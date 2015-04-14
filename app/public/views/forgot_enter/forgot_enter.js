'use strict';

angular.module('app.forgot_enter', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/forgot/:id', {
    templateUrl: 'views/forgot_enter/forgot_enter.html',
    controller: 'ForgotEnterCtrl'
  });
}])

.controller('ForgotEnterCtrl', ['$scope','$routeParams','$location','$timeout','AuthService','AllService',function($scope,$routeParams,$location,$timeout,AuthService,AllService) {
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
    $location.path('/');
  }

  function changeFail(data, status, headers, config) {
  	console.log(status)
  }
}]);