'use strict';

angular.module('app.login', ['ngRoute','ngAnimate','app.userService'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/login/login.html',
    controller: 'LoginCtrl'
  });

}])

.controller('LoginCtrl', ['$scope','$location','$timeout','UserService',function($scope,$location,$timeout,UserService) {
	$scope.userData = {
		"email":"",
		"password":""
	}

	$scope.sendForm = function(){
		UserService.login($scope.userData).success(checklogin).error(faillogin);
	}

	function checklogin(data, status, headers, config) {
    $location.path(data);
  }

  function faillogin(data, status, headers, config) {
  	console.log(status)
  }
}]);