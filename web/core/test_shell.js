var Client = require('ssh2').Client;
var SHA1 = require('sha1');
var conn = new Client();

var conn_pool = {};

var initConnection = function(config,callback){
    conn.on('ready', function() {
        console.log('ssh连接成功，等待执行命令');
        var conn_key = hashKey(config);
        conn_pool[conn_key] = conn;
        callback(conn);
    }).connect({
        host: config.host,
        port: config.port || 22,
        username: config.username,
        password: config.password
    });
};

var hashKey = function (config){
    var config_string = JSON.stringify(config);
    return SHA1(config_string)
};

var execCommands = function (req,res){
    var commands = req.param('command');
    var config = {
        'host':'onekoko.com',
        'port':'22',
        'username':'chenhao',
        'password':'chenhao'
    };
    var conn_key = hashKey(config);
    if (conn_pool.hasOwnProperty(conn_key)){
        exce(conn_pool[conn_key]);
    }else{
        initConnection(config,exce(conn));
    };

    function exce(connection){
        connection.exec(commands, function(err, stream) {
            if (err) throw err;
            stream.on('close', function(code, signal) {
                console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                conn.end();
            }).on('data', function(data) {
                console.log(data);
                console.log('----------------');
                //res.send(data);

            }).stderr.on('data', function(data) {
                    console.log('STDERR: ' + data);
                });
        });
    }
};

exports.execCommands = execCommands;