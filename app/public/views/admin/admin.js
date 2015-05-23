'use strict';

angular.module('app.admin', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/admin', {
    templateUrl: 'views/admin/admin.html',
    controller: 'AdminCtrl'
  });
}])

.controller('AdminCtrl', ['AuthService','$scope',function(AuthService,$scope) {
	$scope.logout = function(){

		AuthService.logout();
	}
}]);