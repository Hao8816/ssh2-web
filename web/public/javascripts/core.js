//

function dashboardController($scope,$http){

    $scope.exceCommands = function($event){
        if ($event.keyCode == 13){
            $http.post('/exec_command/',{'command': $scope.command}).success(function(data){

                $scope.result = data;
            })
        }


    }

}