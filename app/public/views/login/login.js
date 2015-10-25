'use strict';

angular.module('app.login', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/login/login.html',
    controller: 'LoginCtrl'
  });

}])

.controller('LoginCtrl', ['$scope','$location','$timeout','AuthService','AllService','MessageService',function($scope,$location,$timeout,AuthService,AllService,MessageService) {
  var ua = navigator.userAgent.toLowerCase();

  if (ua.indexOf('chrome') > -1) {
    // $scope.userData = {
    //   "email":"patrickfieger90@gmail.com",
    //   "password":"1234"
    // }

    $scope.userData = {
      "email":"p@jpy.io",
      "password":"123456"
    }

    

  }else{
    $scope.userData = {
      "email":"oliver.bock@steinbock.info",
      "password":"kleine"
    }
  }

	$scope.sendLogin = function(){
		AuthService.login($scope.userData).success(checklogin).error(faillogin);
	}

	function checklogin(data, status, headers, config) {
    $location.path(data);
    AllService.checkAvatarInfos();
  }

  function faillogin(data, status, headers, config) {
  	MessageService.danger(2)
  }
}]);