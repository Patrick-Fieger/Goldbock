'use strict';

angular.module('app.admin', ['ngRoute','ngAnimate','app.userService'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/admin', {
    templateUrl: 'views/admin/admin.html',
    controller: 'AdminCtrl'
  });
}])

.controller('AdminCtrl', ['$scope','$location','$timeout',function($scope,$location,$timeout) {
	
}]);

