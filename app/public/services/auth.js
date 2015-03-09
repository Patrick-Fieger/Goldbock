angular.module('app.authService', [])
.service('AuthService', function($http,$location){
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

	};

	return {
		login : login,
		logout : logout,
		isAuth : isAuth
	}
});