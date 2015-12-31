'use strict';

angular.module('app.forgot', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/forgot', {
    templateUrl: 'views/forgot/forgot.html',
    controller: 'ForgotCtrl'
  });
}])

.controller('ForgotCtrl', ['$scope','$location','$timeout','AuthService','AllService','MessageService',function($scope,$location,$timeout,AuthService,AllService,MessageService) {
	$scope.userData = {
		"email":""
	}

	$scope.sendForgot = function(){
		AuthService.forgot($scope.userData).success(checkforgot).error(failforgot);
	}

	function checkforgot(data, status, headers, config) {
    MessageService.info(0)
    $location.path('/');
  }

  function failforgot(data, status, headers, config) {
  	MessageService.danger(0)
  }
}]);