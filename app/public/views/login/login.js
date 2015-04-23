'use strict';

angular.module('app.login', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/login/login.html',
    controller: 'LoginCtrl'
  });

}])

.controller('LoginCtrl', ['$scope','$location','$timeout','AuthService','AllService',function($scope,$location,$timeout,AuthService,AllService) {
	$scope.userData = {
		"email":"patrickfieger90@gmail.com",
		"password":"123"
	}

	$scope.sendLogin = function(){
		AuthService.login($scope.userData).success(checklogin).error(faillogin);
	}

	function checklogin(data, status, headers, config) {
    $location.path(data);
    AllService.checkAvatarInfos();
  }

  function faillogin(data, status, headers, config) {
  	console.log(status)
  }
}]);