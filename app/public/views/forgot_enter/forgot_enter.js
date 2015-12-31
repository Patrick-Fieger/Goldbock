'use strict';

angular.module('app.forgot_enter', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/forgot/:id', {
    templateUrl: 'views/forgot_enter/forgot_enter.html',
    controller: 'ForgotEnterCtrl'
  });
}])

.controller('ForgotEnterCtrl', ['$scope','$routeParams','$location','$timeout','AuthService','AllService','MessageService',function($scope,$routeParams,$location,$timeout,AuthService,AllService,MessageService) {
  $scope.userData = {
    token : $routeParams.id,
		password : "",
    passwordRepeat : ""
	}

	$scope.sendForgot = function(){
    if($scope.userData.password !== "" && $scope.userData.passwordRepeat !== "" && $scope.userData.password === $scope.userData.passwordRepeat){
      AuthService.updatePassword($scope.userData).success(changeSuccess).error(changeFail);
    }
	}

	function changeSuccess(data, status, headers, config) {
    MessageService.info(3)
    $location.path('/');
  }

  function changeFail(data, status, headers, config) {
  	MessageService.danger(0)
  }
}]);