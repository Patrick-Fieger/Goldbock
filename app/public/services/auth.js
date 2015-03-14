angular.module('app.authService', [])
.service('AuthService', function($http,$location,$rootScope){
	var isAuth = function(){
		$http.get('/authenticated',{params: { path: $location.path()}})
    	.error(function (data, status, headers, config) {
    		$location.path('/');
    	});	
	}

	var checkAvatarInfos = function(){
		isLoggedIn().success(getAvatarInfos).error(hideAvatarInfos)
	}

	var isLoggedIn = function(){
		return $http.get('/isloggedin')
	}

	var getAvatarInfos = function(){
		return $http.get('/avatarinfos').success(updateAvatar)
	}

	function updateAvatar(data, status, headers, config){
		$rootScope.isLogged = true;
    	$rootScope.fullname = data.fullname;
    	$rootScope.einstellungen = data.role + '/einstellungen/'
    	

        if (data.avatar !== undefined) {
        	$rootScope.avatar = data.avatar
        }
        else{
        	$rootScope.avatar = 'img/avatar/avatar.png';
        }
	}

	function hideAvatarInfos(){
		$rootScope.isLogged = false;
		$rootScope.fullname = "";
		$rootScope.avatar = "";
	}

	var login = function(data){
		return $http.post('/login', data)
	};

	var logout = function(user){
		$http.post('/logout');
		$rootScope.isLogged = false;
		$location.path('/');
	};

	return {
		login : login,
		logout : logout,
		isAuth : isAuth,
		checkAvatarInfos: checkAvatarInfos
	}
});