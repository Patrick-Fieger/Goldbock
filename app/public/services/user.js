angular.module('app.userService', [])
.service('UserService', function($http){
	var register = function(data){
		return $http.post('/create', data)
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