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

	var categories = function(){
		return $http.get('/categories');
	}

	var favorites = function(data){
		return $http.post('/favorites', data);
	}

	var offer = function(id){
		return $http.get('/offer',{params: { id : id}})
	}

	var deleteOffer = function(id){
		return $http.delete('/offer',{params: { id : id}})
	};

	var addAdvertising = function(data){
		return $http.post('/add/advertising', data);
	}

	var updatePassword = function(oldpassword, newpassword){

	};
	var deleteAccount = function(user){

	};

	return{
		register : register,
		updatePassword : updatePassword,
		deleteAccount : deleteAccount,
		offers : offers,
		offer : offer,
		deleteOffer : deleteOffer,
		updateProfile : updateProfile,
		categories : categories,
		favorites : favorites,
		addAdvertising : addAdvertising
	}
})