'use strict';

angular.module('app.register', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/register', {
    templateUrl: 'views/register/register.html',
    controller: 'RegisterCtrl'
  });
}])

.controller('RegisterCtrl', ['$scope','$location','$timeout','AuthService','AllService',function($scope,$location,$timeout,AuthService,AllService) {
	$scope.userData = {
		"email":"",
		"password":""
	}

	$scope.sendRegister = function(){
		AuthService.register($scope.userData).success(checkregister).error(failregister);
	}

	function checkregister(data, status, headers, config) {
    $location.path(data);
    AllService.checkAvatarInfos();
  }

  function failregister(data, status, headers, config) {
  	console.log(status)
  }
}]);