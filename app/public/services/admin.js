angular.module('app.adminService', [])
.service('AdminService', function($http){


	var getAllUsers = function(){
		return $http.get('/allUsers')
	}


	var getProviders = function(){
		return $http.get('/getProviders')
	}

	var getOffers = function(){
		return $http.get('/getOffers')
	}

	var	getUsers = function(){
		return $http.get('/getUsers')
	}

	var	getCompanys = function(){
		return $http.get('/getCompanys')
	}

	var updateProfile = function(data){
		return $http.post('/admin/update/profile' , data)
	}

	var saveCategories = function(data){
		return $http.post('/admin/update/categories' , data)
	}

	var toggleActivate = function(data){
		return $http.post('/toggle/activate' , data)
	}

	var changeOffer = function(data){
		return $http.post('/change/offer/state' , data);
	}




	return{
		changeOffer : changeOffer,
		getAllUsers : getAllUsers,
		getProviders : getProviders,
		getOffers : getOffers,
		getUsers : getUsers,
		updateProfile : updateProfile,
		saveCategories : saveCategories,
		toggleActivate : toggleActivate
	}
})