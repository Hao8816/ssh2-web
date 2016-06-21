//

function dashboardController($scope,$http){

    var socket = io('http://127.0.0.1:8088');
    socket.on('connect', function(){
        console.log('连接消息服务器成功');
        // 获取图标初始化数据
    });

    socket.on('std_out',function(data){
        console.log(data);
        $scope.result = data['result'];
        $scope.$apply();
    });
    socket.on('disconnect', function(){});

    $scope.exceCommands = function($event){
        if ($event.keyCode == 13){
            //$http.post('/exec_command/',{'command': $scope.command}).success(function(data){
            //
            //    $scope.result = data;
            //})
            socket.emit('exec_command',{"commands": $scope.command})
        }
    }

}