'use strict';

angular.module('app.profile', ['ngRoute'])

.controller('ProfileCtrl', ['$scope','$location','$timeout','ProviderService','AllService','AuthService','UploadService','$rootScope','MessageService','socket','UserService',function($scope,$location,$timeout,ProviderService,AllService,AuthService,UploadService,$rootScope,MessageService,socket,UserService) {
	$scope.profile = {};
	$scope.post = {
		text : "",
		link : "",
		name : "",
		profile_id : "",
		role : "",
		email : "",
		image : "",
		avatar : {}
	};
	$scope.avatar;
	$scope.showAboutTextarea = false;
	$scope.editstate = false;
	$scope.hideAddOffer = false;
	$scope.passstate = false;
	$scope.poststate = false;
	$scope.advert = false;
	$scope.showAboutTextareaText;
	$scope.about;
	$scope.count = 400;
	$scope.password = {};
	$rootScope.postview = false;
	$rootScope.postToView = null;
	var user = localStorage.getItem('user');
	var cloneInput = $("#postInput").clone(true)


	$('#profile').height($(window).height());

	$scope.counter = [];
	$rootScope.posts = [];
	$rootScope.postToViewComment = "";

	AllService.profile().success(updateProfileView);

	socket.emit('join',{email : user})
	socket.emit('get unreaded messages',{email : user},unreadedCount)
	socket.on('new chat opened',function(data){
		if($scope.counter.indexOf(data.id) == -1){
			$scope.counter.push(data.id);
		}
	});

	socket.emit('all posts',{},buildPosts)

	socket.on('new post arrived',function(data){
		var d = data;
		d.date = moment(d.date).format("MM/DD/YYYY HH:mm");
		if(d.link){
			d.link.indexOf('youtube') > -1 ? d.youtube = true : d.youtube = false;
			d.link = d.link.replace("watch?v=", "v/");
		}
		$rootScope.posts.unshift(data);
	});

	function buildPosts(data){
		var d = data;
		for (var i = 0; i < d.length; i++) {
			d[i].date = moment(d[i].date).format("MM/DD/YYYY HH:mm");
			if(d[i].link){
				d[i].link.indexOf('youtube') > -1 ? d[i].youtube = true : d[i].youtube = false;
				d[i].link = d[i].link.replace("watch?v=", "v/");
			}
		};
		$rootScope.posts = d
	}

	function unreadedCount(data){
		$scope.counter = data;
	}

	$rootScope.loadPostView = function (id){
		for (var i = 0; i < $rootScope.posts.length; i++) {
			if($rootScope.posts[i].id == id){
				if($rootScope.postToView){
	      			$rootScope.postToView.image = null;
				}

				if($rootScope.posts[i].messages.length !== 0){
					for (var k = 0; k < $rootScope.posts[i].messages.length; k++) {
						if(!moment($rootScope.posts[i].messages[k].date, "DD/MM/YYYY HH:mm", true).isValid()){
							$rootScope.posts[i].messages[k].date =  moment($rootScope.posts[i].messages[k].date).format("DD/MM/YYYY HH:mm");
						}
					};
				}


				$rootScope.postToView = $rootScope.posts[i];
				if(!$rootScope.postToView.messages){
					$rootScope.postToView.messages = [];
				}
				$rootScope.postview = true;
			}
		};

	}

	$rootScope.addCommentPost = function(id){
		var message = {
			id : id,
			text : $rootScope.postToViewComment
		}
		AllService.addCommentPost(message).success(function(data){
			console.log(data)
			$rootScope.postToView.messages.unshift(data);
		});
	}

	function updateProfileView(data, status, headers, config){
		$scope.profile = data;
		setTimeout(function(){
			$('.addvertising_bg,.addvertising,.crop_wrapper').removeAttr('style')
		},1000)

		if(data.offers){
			if(data.offers.length >= 3){
				$scope.hideAddOffer = true
			}
		}


		if (data.avatar !== undefined) {
        	$scope.profile.avatar.big = data.avatar.big.replace('public/','')
        	$scope.profile.avatar.small = data.avatar.small.replace('public/','')
        }
        else{
        	$scope.profile.avatar = {};
        	$scope.profile.avatar.big = 'img/avatar/avatar.png';
        	$scope.profile.avatar.small = 'img/avatar/avatar.png';
        }

        $scope.post.profile_id = $scope.profile.id;
		$scope.post.role = $scope.profile.role;
		$scope.post.avatar = $scope.profile.avatar;
		$scope.post.email = $scope.profile.email;
		$scope.post.name = $scope.profile.firstname + ' ' + $scope.profile.lastname


        localStorage.setItem('user',data.email)
        localStorage.setItem('role',data.role)
        checkAboutText();
	}

	function checkAboutText(){
		if($scope.profile.about !== undefined && $scope.profile.about !== ""){
        	nltobr();
        }else{
        	$scope.showAboutTextareaText = false;
        }
	}

	function nltobr() {
		$scope.about = $scope.profile.about.replace(/(?:\r\n|\r|\n)/g, '<br />');
		$scope.showAboutTextareaText = true;
		$scope.countText();
	}



	$scope.editProfile = function(){
		$scope.showAboutTextarea = true;
		$scope.editstate = true;
	}

	$scope.editPass = function(){
		$scope.passstate = true;
	}

	$scope.editPost = function(){
		$scope.poststate = true;
	}

	$scope.cancel = function(){
		$scope.showAboutTextarea = false;
		$scope.editstate = false;
		$scope.passstate = false;
		$scope.poststate = false;
	}

	$scope.save = function(){
		if($scope.userdata.$valid && $scope.editstate) {
			var data = angular.copy($scope.profile);
			if($scope.profile.role == "provider"){
				ProviderService.updateProfile(data).success(updateProfileSuccess);
			}else{
				UserService.updateProfile(data).success(updateProfileSuccess);
			}
     	}else if ($scope.pass.$valid && $scope.passstate){
     		var data = angular.copy($scope.password);
     		AllService.updatePassword(data).success(changePasswordSuccess);
     	}else if($scope.post_form.$valid && $scope.poststate){
     		// var data = angular.copy($scope.post);
     		var file = $("#postInput")[0].files[0]
     		if(file){
     			if($("#postInput")[0].files[0].size <= 1000000){

     				AllService.uploadPostImage(file).success(function(data){
     					$scope.post.image = data;
     					addPost();
     				})

     			}else{
     				resetPostInput();
     				alert('Die Datei ist zu größer als 1 MB!');
     			}
     		}else{
     			addPost();
     		}
     	}else{
     		alert('Bitte füllen sie alle notwendigen Felder aus!');
     	}
	}

	function addPost(){
		socket.emit('new post',{data : $scope.post},function(data){
			var d = data;
			d.date = moment(d.date).format("DD/MM/YYYY HH:mm");
			if(d.link){
				d.link.indexOf('youtube') > -1 ? d.youtube = true : d.youtube = false;
				d.link = d.link.replace("watch?v=", "v/");
			}
			$rootScope.posts.unshift(data);
		});
		$scope.post.text = "";
		$scope.post.link = "";
		$scope.cancel();
	}

	function resetPostInput(){
		$("#postInput").replaceWith(cloneInput);
	}


	function updateProfileSuccess(){
		checkAboutText();
		$scope.cancel();
		//AllService.updateName($scope.profile.firstname + ' ' + $scope.profile.lastname);
		MessageService.info(6);
	}

	function changePasswordSuccess(){
		$scope.cancel();
		MessageService.info(10);
	}

	function updateAvatarsView(data, status, headers, config){
		//$rootScope.avatar.small = data.small.replace('public/','');
		$scope.profile.avatar.big = data.big.replace('public/','');
		$scope.profile.avatar.small = data.small.replace('public/','');
		$scope.cancelCrop();
	}

	$scope.countText = function(){
		$scope.count = 400 - $scope.profile.about.length - ($scope.profile.about.match(/\n/g)||[]).length;
	}

	$scope.redirectEdit = function(id){
		$location.path('/edit/'+id)
	}

	$scope.deleteOffer = function(id){
		if(confirm('Möchten sie das Angebot wirklich löschen?')){
			ProviderService.deleteOffer(id).success(updateOfferList)
		}
	}

	function updateOfferList(data, status, headers, config){
		var id = data;
		for(var i = 0; i < $scope.profile.offers.length; i++) {
		    var obj = $scope.profile.offers[i];
		    if( id == obj.id) {
		        $scope.profile.offers.splice(i, 1);
		        $scope.hideAddOffer = false;
		    }
		}
		MessageService.danger(3)
	}

	$scope.myImage='';
	$scope.myCroppedImage='';
	$scope.showCrop = false;

	$scope.logout = function(){
		AuthService.logout();
	}


	$scope.cancelCrop = function(){
		$scope.myImage='';
		$scope.myCroppedImage='';
		$scope.showCrop = false;
	}

	var handleFileSelect=function(event) {
	  var file=event.target.files[0];
	  var reader = new FileReader();
	  reader.onload = function (evt) {
	    $scope.$apply(function($scope){
	      $scope.myImage = evt.target.result;
	      $scope.showCrop = true;
	    });
	  };
	  reader.readAsDataURL(file);
	};
	angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

	$scope.uploadAvatar = function(){
		UploadService.avatar({data:$scope.myCroppedImage}).success(updateAvatarsView)
	}

	$scope.addAdvertising = function(){
		$scope.advert = !$scope.advert;
	}

	$scope.addindex = 0;

	$scope.toggleClassActive = function(e,index){
		$scope.addindex = index;

		$('.addvertising li').removeClass('active')
		$(e.target).addClass('active');
	}

	$scope.sendAdd = function(){
		ProviderService.addAdvertising({
			ad : $scope.profile.offers[$scope.addindex]
		}).success(addSuccess).error(onlyOnWeek)
	}

	function addSuccess(){
		MessageService.info(9);
		$scope.advert = !$scope.advert;
	}

	function onlyOnWeek(){
		MessageService.danger(6);
	}

	$scope.openMenu = function(){
		$rootScope.showmenu = !$rootScope.showmenu;
	}
}]);
