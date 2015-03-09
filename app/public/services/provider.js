angular.module('app.providerService', [])
.service('ProviderService', function($http){
	var register = function(data){
		return $http.post('/createprovider', data)
	};

	var updatePassword = function(oldpassword, newpassword){

	};
	var deleteAccount = function(user){

	};

	return{
		register : register,
		updatePassword : updatePassword,
		deleteAccount : deleteAccount
	}
})