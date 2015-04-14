angular.module('app.authService', [])
.service('AuthService', function($http,$location,$rootScope){
	var isAuth = function(){
		$http.get('/authenticated',{params: { path: $location.path()}})
    	.error(function (data, status, headers, config) {
    		$location.path('/');
    	});	
	}

	var login = function(data){
		return $http.post('/login', data)
	};

	var logout = function(){
		$http.post('/logout')
		$rootScope.isLogged = false;
		$location.path('/');
	};

	var register = function(user){
		return $http.post('/register', user)
	};

	var forgot = function(user){
		return $http.post('/forgot', user)
	};

	return {
		login : login,
		logout : logout,
		register : register,
		forgot : forgot,
		isAuth : isAuth,
	}
});