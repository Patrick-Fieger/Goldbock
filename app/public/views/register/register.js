'use strict';

angular.module('app.register', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/register', {
    templateUrl: 'views/register/register.html',
    controller: 'RegisterCtrl'
  });
}])

.controller('RegisterCtrl', ['$scope','$location','$timeout','AuthService','AllService','MessageService',function($scope,$location,$timeout,AuthService,AllService,MessageService) {
	$scope.userData = {
		"email":"",
		"password":"",
    "firstname": "",
    "lastname": ""
	}

	$scope.sendRegister = function(){
		AuthService.register($scope.userData).success(checkregister).error(failregister);
	}

	function checkregister(data, status, headers, config) {
    MessageService.info(0)
    $location.path('/');
    
  }

  function failregister(data, status, headers, config) {
  	MessageService.danger(4)
  }
}]);