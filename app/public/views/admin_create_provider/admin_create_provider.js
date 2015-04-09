'use strict';

angular.module('app.admin_provider', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/admin/create/provider', {
    templateUrl: 'views/admin_create_provider/admin_create_provider.html',
    controller: 'AdminCreateProviderCtrl'
  });
}])

.controller('AdminCreateProviderCtrl', ['AuthService','$scope','$location','$timeout','ProviderService',function(AuthService,$scope,$location,$timeout,ProviderService) {
	$scope.provider = {
		company :"",
		lastname :"",
		firstname :"",
		email :"",
		street :"",
		city :"",
		zip :0,
		tel :""
	}

	$scope.logout = function(){
		AuthService.logout();
	}

	$scope.registerProvider = function(){
		ProviderService.register($scope.provider).success(providerIsRegistered).error(providerRegistrationError);	
	}
	
	function providerIsRegistered(){

	}

	function providerRegistrationError(){

	}

}]);

