'use strict';

angular.module('app.admin_provider', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/admin/create/provider', {
    templateUrl: 'views/admin_create_provider/admin_create_provider.html',
    controller: 'AdminCreateProviderCtrl'
  });
}])

.controller('AdminCreateProviderCtrl', ['$scope','$location','$timeout',function($scope,$location,$timeout) {
	
}]);

