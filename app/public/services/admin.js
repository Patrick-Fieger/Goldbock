angular.module('app.adminService', [])
.service('AdminService', function($http){


	var getAllUsers = function(){
		return $http.get('/allUsers')
	}


	var getProviders = function(){
		return $http.get('/getProviders')
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

	return{
		getAllUsers : getAllUsers,
		getProviders : getProviders,
		getUsers : getUsers,
		updateProfile : updateProfile,
		saveCategories : saveCategories,
		toggleActivate : toggleActivate
	}
})