'use strict';

angular.module('app.forgot', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/forgot', {
    templateUrl: 'views/forgot/forgot.html',
    controller: 'ForgotCtrl'
  });
}])

.controller('ForgotCtrl', ['$scope','$location','$timeout','AuthService','AllService',function($scope,$location,$timeout,AuthService,AllService) {
	$scope.userData = {
		"email":""
	}

	$scope.sendForgot = function(){
		AuthService.forgot($scope.userData).success(checkforgot).error(failforgot);
	}

	function checkforgot(data, status, headers, config) {
    $location.path('/');
  }

  function failforgot(data, status, headers, config) {
  	console.log(status)
  }
}]);