angular.module('app.allService', [])
.service('AllService', function($http,$location,$rootScope){
	var profile = function(){
		return $http.get('/profile');
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

	var updatePassword = function(data){
		return $http.post('/update/password' , data)
	}

	function updateAvatar(data, status, headers, config){
		$rootScope.avatar = {
			small : "",
			big : ""
		}
		$rootScope.isLogged = true;
    	$rootScope.fullname = data.fullname;
    	$rootScope.einstellungen = '#/' + data.role + '/dashboard/'
        if (data.avatar !== undefined) {
        	$rootScope.avatar.small = data.avatar.small.replace('public/','')
        }
        else{
        	$rootScope.avatar.small = 'img/avatar/avatar.png';
        }
	}

	function updateName(name){
		$rootScope.fullname = name;
	}

	function removePublicInLink(link){
		return link.replace('public/','');
	}

	function hideAvatarInfos(){
		$rootScope.isLogged = false;
		$rootScope.fullname = "";
		$rootScope.avatar = {};
	}

	return {
		checkAvatarInfos: checkAvatarInfos,
		profile : profile,
		updateName : updateName,
		updatePassword : updatePassword,
		removePublicInLink : removePublicInLink
	}
});