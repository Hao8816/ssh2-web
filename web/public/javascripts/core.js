var BaseCommand = {
    "CD": 'cd' // 进入文件夹
};

var KeyBoard = {
    "Enter": 13,
    "Tab" : 9

};

// 初始化客户端连接
var socket = io('http://onekoko.com:8089');
//var socket = io('http://127.0.0.1:8089');


function loginController($rootScope,$scope){

    socket.on('connect', function(){
        console.log('连接消息服务器成功');
        // 获取图标初始化数据
    });

    $scope.login = function(){
        socket.emit('login',$scope.user);
    };

    socket.on('login_success',function(data){
        $rootScope.login_success = true;
        $rootScope.username = data['username'];
        $rootScope.$apply();
    });
}


//
function dashboardController($rootScope,$scope){
    $scope.current_stack = [];
    $scope.current_path = $scope.current_stack.join("/");

    socket.on('std_out',function(data){
        console.log(data);
        $scope.result = data['result'];
        $scope.$apply();
    });
    socket.on('disconnect', function(){
        $rootScope.login_success = false;
    });

    $scope.exceCommands = function($event){

        // 根据不同的键盘事件，响应不同的操作
        switch ($event.keyCode){

            case KeyBoard.Enter :
                // 键盘enter 执行命令
                resolveCommand();
                break;
            case KeyBoard.Tab :
                break;
            default :
                console.log("不支持的操作");
                break;

        }
    }


    // 处理和相关的命令
    function resolveCommand(){
        // 分析用户输入的评论
        var command = $scope.current_command;
        var commands = command.split(" ");
        var base_command = commands[0];

        // 首先我们来处理cd 相关的命令
        if (base_command == BaseCommand.CD){
            // 判断后面跟的是什么
            if (commands.length > 1){
                var path_commands = commands[1].split("/");
                // 如果剩余的命令是 ../../ 表示
                if (path_commands[0] == ".."){
                    path_commands.forEach(function(obj){
                        if (obj == ".." && $scope.current_stack.length>0){
                            $scope.current_stack.pop();
                            $scope.current_path = $scope.current_stack[$scope.current_stack.length-1];
                        }
                    })
                }else{
                    // 如果剩余命令是 data/name/
                    var current_stack = $scope.current_stack
                    var current_stack =current_stack.concat(path_commands);
                    $scope.current_stack = current_stack;
                    $scope.current_path = path_commands[path_commands.length-1];
                }

            }else{
                // 如果后面什么都没有,退还到根目录
                $scope.current_stack = [];
                $scope.current_path = "";
            }
        }else{
            // command 和 path的信息相关
            var current_stack = $scope.current_stack;
            if (current_stack.length > 0){
                var shell_command = "cd "+current_stack.join("/")+ " && " + command;
            }else{
                var shell_command = command;
            }
            socket.emit('exec_command',{"commands": shell_command});
        }

        $scope.current_command = "";
    }
}
