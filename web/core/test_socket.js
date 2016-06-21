var Server = require('socket.io');
var io = new Server();
var Client = require('ssh2').Client;
var SHA1 = require('sha1');
var conn = new Client();

conn.on('ready', function() {
    console.log('ssh连接成功，等待执行命令');

}).connect({
    host: 'onekoko.com',
    port: '22',
    username: 'chenhao',
    password: 'chenhao'
});
/*
 * 监听连接
 * */
io.on('connection', function(socket){

    console.log('收到新的连接,连接的ID:', socket.id);
    // 建立连接成功
    socket.emit('connected', { msg: '连接建立成功', code : '001' });

    /*                         数据采集相关的事件和函数                            */
    /****************************************************************************/

    // 客户端建立连接成功的回调
    socket.on('exec_command',function(data){
        var commands = data["commands"];

        conn.exec(commands, function(err, stream) {
            if (err) throw err;
            stream.on('close', function(code, signal) {
                console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                //conn.end();
            }).on('data', function(res) {
                console.log(res);
                socket.emit('std_out',{'result': res.toString()})

            }).stderr.on('data', function(data) {
                    console.log('STDERR: ' + data);
                });
        });


    });

});

io.listen(8088);