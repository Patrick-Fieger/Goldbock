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
		return $http.post('/admin/update/profile',data)
	}

	return{
		getAllUsers : getAllUsers,
		getProviders : getProviders,
		updateProfile : updateProfile
	}
})