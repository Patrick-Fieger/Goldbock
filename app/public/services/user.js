angular.module('app.userService', [])
.service('UserService', function($http){
	var register = function(data){
		return $http.post('/create', data)
	};

	var deleteAccount = function(user){

	};

	var categories = function(){
		return $http.get('/categories');
	}

	var updateProfile = function(data){
		var data_ = data;
		delete data_.role;
		delete data_.email;
		delete data_.__v;
		delete data_._id;
		delete data_.avatar;
		delete data_.offers;
		delete data_.password;
		delete data_.liked;
		return $http.post('/update/user', data_)
	}

	var alloffers = function(){
		return $http.get('/alloffers');
	}
	var getAds = function(){
		return $http.get('/adds');
	}
	

	return{
		register : register,
		deleteAccount : deleteAccount,
		updateProfile : updateProfile,
		categories : categories,
		alloffers : alloffers,
		getAds : getAds
	}
})