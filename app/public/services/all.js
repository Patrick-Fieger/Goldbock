angular.module('app.allService', [])
.service('AllService', function($http,$location,$rootScope){
	var profile = function(){
		return $http.get('/profile');
	}

	var checkUnreadedMessages = function(){
		return $http.get('/unreadedmessages')
	}

	//var checkAvatarInfos = function(){
	//	isLoggedIn().success(getAvatarInfos).error(hideAvatarInfos)
	//}

	var isLoggedIn = function(){
		return $http.get('/isloggedin')
	}

	var getAvatarInfos = function(){
		return $http.get('/avatarinfos');
	}

	var updatePassword = function(data){
		return $http.post('/update/password' , data)
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

	function getAllUsers(){
		return $http.get('/getallusers')
	}

	return {
		getAllUsers : getAllUsers,
		//checkAvatarInfos: checkAvatarInfos,
		profile : profile,
		updateName : updateName,
		updatePassword : updatePassword,
		removePublicInLink : removePublicInLink,
		getAvatarInfos : getAvatarInfos
	}
});