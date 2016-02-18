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

	function uploadPostImage(data){
		var formData = new FormData();
		formData.append('files', data);

		return $http.post('/post/image/upload', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
	}

	function postLinks(text){
		return $http.get('/post/links',{params: { text : text}});
	}

	function addCommentPost(data){
		return $http.post('/post/add/comment',data);
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
		getAvatarInfos : getAvatarInfos,
		uploadPostImage : uploadPostImage,
		addCommentPost : addCommentPost,
		postLinks : postLinks
	}
});