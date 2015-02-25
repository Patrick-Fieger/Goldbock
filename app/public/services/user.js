var url = '/';
angular.module('app.userService', [])

/**
 * Service um Funktionen in Controllern freizugeben
 * Alle Funktionen die auf einen User angewendet werden können
 */
.service('UserService', function($http){
	var login = function(data){
		return $http.post(url + 'login', data)
	};
	var register = function(data){
		return $http.post(url + 'create', data)
	};
	var logout = function(user){

	};
	var updatePassword = function(oldpassword, newpassword){

	};
	var deleteAccount = function(user){

	};

	return{
		login : login,
		register : register,
		logout : logout,
		updatePassword : updatePassword,
		deleteAccount : deleteAccount
	}
})