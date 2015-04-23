'use strict';

angular.module('app.verify_email', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/verify/email/:token', {
    templateUrl: 'views/verify_email/verify_email.html',
    controller: 'VerifyEmailCtrl'
  });
}])

.controller('VerifyEmailCtrl', ['$scope','$routeParams','$location','$timeout','AuthService','AllService',function($scope,$routeParams,$location,$timeout,AuthService,AllService) {
  AuthService.verifyEmail({token : $routeParams.token}).success(changeSuccess).error(changeFail);

	function changeSuccess(data, status, headers, config) {
    $location.path('/');
  }

  function changeFail(data, status, headers, config) {
  	console.log(status)
  }
}]);