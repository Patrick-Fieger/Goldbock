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
		company : "Thai Massage Sushi GmbH",
		lastname : "Kao",
		firstname : "Lak",
		email : "patrickfieger90@gmail.com",
		street : "Massage-Straße 56",
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

