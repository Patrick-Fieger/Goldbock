'use strict';

angular.module('app.profile', ['ngRoute'])

.controller('ProfileCtrl', ['$scope','$location','$timeout','ProviderService','AllService','AuthService','UploadService','$rootScope','MessageService','socket','UserService',function($scope,$location,$timeout,ProviderService,AllService,AuthService,UploadService,$rootScope,MessageService,socket,UserService) {
	$scope.profile = {};
	$scope.avatar;
	$scope.showAboutTextarea = false;
	$scope.editstate = false;
	$scope.hideAddOffer = false;
	$scope.passstate = false;
	$scope.advert = false;
	$scope.showAboutTextareaText;
	$scope.about;
	$scope.count = 400;
	$scope.password = {};
	var user = localStorage.getItem('user');

	$('#profile').height($(window).height());

	$scope.counter = [];

	AllService.profile().success(updateProfileView);



	socket.emit('join',{email : user})
	socket.emit('get unreaded messages',{email : user},unreadedCount)
	socket.on('new chat opened',function(data){
		if($scope.counter.indexOf(data.id) == -1){
			$scope.counter.push(data.id);
		}
	});

	function unreadedCount(data){
		$scope.counter = data;
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

	$scope.cancel = function(){
		$scope.showAboutTextarea = false;
		$scope.editstate = false;
		$scope.passstate = false;
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
     	}else{
     		alert('Bitte füllen sie alle notwendigen Felder aus!')
     	}
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

// .controller('ProfileCtrl', ['AuthService','AllService','$scope','$rootScope',function(AuthService,AllService,$scope,$rootScope) {
// 	$scope.advert,
// 	$scope.showCrop,
// 	$scope.editstate,
// 	$scope.passstate = false;
// 	AllService.profile().success(buildProfileView);

// 	function buildProfileView(data, status, headers, config){
// 		$scope.profile = data;
// 		$scope.profile.avatar.small = $scope.profile.avatar.small.replace('public/','');
// 		$scope.profile.avatar.big = $scope.profile.avatar.big.replace('public/','');
// 	}

// 	$scope.openMenu = function(){
// 		$rootScope.showmenu = true;
// 	}


// 	// Edit Profile
// 	//

// 	$scope.editProfile = function(){
// 		$scope.editstate = true;
// 	}

// 	$scope.editPass = function(){
// 		$scope.passstate = true;
// 	}

// 	$scope.cancel = function(){
// 		$scope.editstate = false;
// 		$scope.passstate = false;
// 	}


// }]);