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

	var logout = function(user){
		$http.post('/logout')
		$rootScope.isLogged = false;
		$location.path('/');
	};

	return {
		login : login,
		logout : logout,
		isAuth : isAuth,
	}
});