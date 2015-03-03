angular.module('app.authService', [])
.service('AuthService', function($http,$location){
	var checkAuth = function(){
		$http.get('/authenticated',{params: { path: $location.path()}}).error(function(){
			$location.path('/');
		});

	}

	return{
		checkAuth : checkAuth
	}
});