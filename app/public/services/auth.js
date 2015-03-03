angular.module('app.authService', [])
.service('AuthService', function($http,$location){
	var isAuth = function(){
		$http.get('/authenticated',{params: { path: $location.path()}})
    	.error(function (data, status, headers, config) {
    		$location.path('/');
    	});	
	}

	return {
		isAuth : isAuth
	}
});