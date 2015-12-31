angular.module('app.authService', [])
.service('AuthService', function($http,$location,$rootScope,$timeout,$window){
	var isAuth = function(){
		$http.get('/authenticated',{params: { path: $location.path()}})
    	.error(function (data, status, headers, config) {
    		$location.path('/');
    	}).success(function(data, status, headers, config){
    		$rootScope.isLogged = true;
    		$rootScope.role = data;
    	});
	}

	var login = function(data){
		return $http.post('/login', data)
	};

	var logout = function(){
		$http.post('/logout')
		$rootScope.isLogged = false;
		$location.path('/');
		localStorage.clear();
		$timeout(function(){
			$window.location.reload();
		},100)
	};

	var register = function(user){
		return $http.post('/register', user)
	};

	var updatePassword = function(data){
		return $http.post('/update/forgot/password', data)
	}

	var forgot = function(user){
		return $http.post('/forgot', user)
	};

	var verifyEmail = function(data){
		return $http.post('/verify/email', data)
	}

	var isAdmin = function(){
		return $http.get('/isadmin')
	}

	return {
		login : login,
		logout : logout,
		register : register,
		forgot : forgot,
		isAuth : isAuth,
		isAdmin : isAdmin,
		verifyEmail : verifyEmail,
		updatePassword : updatePassword
	}
});