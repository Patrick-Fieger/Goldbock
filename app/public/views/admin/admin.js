'use strict';

angular.module('app.admin', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
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