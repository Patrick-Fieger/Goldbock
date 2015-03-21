'use strict';

angular.module('app.admin_provider', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/admin/create/provider', {
    templateUrl: 'views/admin_create_provider/admin_create_provider.html',
    controller: 'AdminCreateProviderCtrl'
  });
}])

.controller('AdminCreateProviderCtrl', ['$scope','$location','$timeout','ProviderService',function($scope,$location,$timeout,ProviderService) {
	$scope.provider = {
		company : "Programierung GmbH",
		lastname : "Fieger",
		firstname : "Patrick",
		email : "patrick@patrick-fieger.com",
		street : "K.-Adenauer-Straße 55",
		city : "Weinheim",
		zip : 69469,
		tel : "0176/78883900"
	}

	$scope.registerProvider = function(){
		ProviderService.register($scope.provider).success(providerIsRegistered).error(providerRegistrationError);	
	}
	
	function providerIsRegistered(){

	}

	function providerRegistrationError(){

	}

}]);

