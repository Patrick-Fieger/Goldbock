angular.module('app.providerService', [])
.service('ProviderService', function($http){
	var register = function(data){
		return $http.post('/createprovider', data)
	};

	var updateProfile = function(data){
		var data_ = data;
		delete data_.role;
		delete data_.email;
		delete data_.__v;
		delete data_._id;
		delete data_.avatar;
		delete data_.offers;
		return $http.post('/update/provider', data_)
	}

	var offers = function(data){
		return $http.get('/offers');
	};

	var updatePassword = function(oldpassword, newpassword){

	};
	var deleteAccount = function(user){

	};

	return{
		register : register,
		updatePassword : updatePassword,
		deleteAccount : deleteAccount,
		offers : offers,
		updateProfile : updateProfile
	}
})