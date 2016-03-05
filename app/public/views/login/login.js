'use strict';

angular.module('app.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/login/login.html',
    controller: 'LoginCtrl'
  });

}])

.controller('LoginCtrl', ['$scope','$location','$timeout','AuthService','AllService','MessageService','$rootScope',function($scope,$location,$timeout,AuthService,AllService,MessageService,$rootScope) {
  var ua = navigator.userAgent.toLowerCase();

  $scope.showAbout = true;

  if (ua.indexOf('chrome') > -1) {
    // $scope.userData = {
    //   "email":"patrickfieger90@gmail.com",
    //   "password":"1234"
    // }

    // $scope.userData = {
    //   "email":"p@jpy.io",
    //   "password":"123456"
    // }
    //


    $scope.userData = {
      "email":"admin@goldbock.de",
      "password":"GoLdBoCk_2014_!"
    }




  }else{
    $scope.userData = {
      "email":"oliver.bock@steinbock.info",
      "password":"kleine"
    }

    // $scope.userData = {
    //   "email":"p@jpy.io",
    //   "password":"123456"
    // }
  }

  $scope.toggleAboutGoldbock = function(){
    $scope.showAbout = !$scope.showAbout;
  }

	$scope.sendLogin = function(){
		AuthService.login($scope.userData).success(checklogin).error(faillogin);
	}

	function checklogin(data, status, headers, config) {
    $rootScope.isLogged = true;
    $location.path(data);
    //AllService.checkAvatarInfos();
  }

  function faillogin(data, status, headers, config) {
  	MessageService.danger(2)
  }
}]);