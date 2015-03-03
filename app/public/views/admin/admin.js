'use strict';

angular.module('app.admin', ['ngRoute','ngAnimate','app.userService','app.authService'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/admin', {
    templateUrl: 'views/admin/admin.html',
    controller: 'AdminCtrl'
  });

}])

.controller('AdminCtrl', ['$scope','$location','$timeout','AuthService',function($scope,$location,$timeout,AuthService) {
	AuthService.checkAuth();
}]);