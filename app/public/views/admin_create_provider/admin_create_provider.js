'use strict';

angular.module('app.admin_provider', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/admin/create/provider', {
    templateUrl: 'views/admin_create_provider/admin_create_provider.html',
    controller: 'AdminCreateProviderCtrl'
  });
}])

.controller('AdminCreateProviderCtrl', ['AuthService','$scope','$location','$timeout','ProviderService','MessageService',function(AuthService,$scope,$location,$timeout,ProviderService,MessageService) {
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
		MessageService.info(2)
	}

	function providerRegistrationError(){

	}

}]);

