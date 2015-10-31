'use strict';

angular.module('app.user_dashboard', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/user/dashboard', {
    templateUrl: 'views/user_dashboard/user_dashboard.html',
    controller: 'UserDashboardCtrl'
  });
}])

.controller('UserDashboardCtrl', ['$scope','$location','$timeout','UserService','AllService','AuthService','UploadService','$rootScope','MessageService','socket','ProviderService',function($scope,$location,$timeout,UserService,AllService,AuthService,UploadService,$rootScope,MessageService,socket,ProviderService) {
	$scope.user = {};
	$scope.avatar;
	$scope.editstate = false;
	$scope.passstate = false;
	$scope.password = {};
	var user = localStorage.getItem('user');

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
		localStorage.setItem('user',data.email);
		localStorage.setItem('role',data.role);
		$scope.user = data;
		if (data.avatar !== undefined) {
        	$scope.user.avatar.big = data.avatar.big.replace('public/','')
        }
        else{
        	$scope.user.avatar = {};
        	$scope.user.avatar.big = 'img/avatar/avatar.png';
        }
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
			var data = angular.copy($scope.user);
       		UserService.updateProfile(data).success(updateProfileSuccess);
     	}else if ($scope.pass.$valid && $scope.passstate){
     		var data = angular.copy($scope.password);
     		AllService.updatePassword(data).success(changePasswordSuccess);
     	}else{
     		alert('Bitte füllen sie alle notwendigen Felder aus!')
     	}
	}

	function updateProfileSuccess(){
		$scope.cancel();
		AllService.updateName($scope.user.firstname + ' ' + $scope.user.lastname);
		MessageService.info(6)
	}

	function changePasswordSuccess(){
		$scope.cancel();
	} 

	function updateAvatarsView(data, status, headers, config){
		$rootScope.avatar.small = data.small.replace('public/','');
		$scope.user.avatar.big = data.big.replace('public/','');
		$scope.cancelCrop();
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

	var handleFileSelect=function(evt) {
	  var file=evt.currentTarget.files[0];
	  var reader = new FileReader();
	  reader.onload = function (evt) {
	    $scope.$apply(function($scope){
	      $scope.myImage = evt.target.result;
	      $scope.showCrop = true
	    });
	  };
	  reader.readAsDataURL(file);
	};
	angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

	$scope.uploadAvatar = function(){
		UploadService.avatar({data:$scope.myCroppedImage}).success(updateAvatarsView)	
	}

	$scope.deleteFav = function(id){
		if(confirm("Wollen sie diesen Favoriten wirklich löschen?")){
			var fav = {
				id : id,
				addOrRemove : true
			}
			
			for (var i = 0; i < $scope.user.liked.length; i++) {
				if($scope.user.liked[i].id == id){
					$scope.user.liked.splice($scope.user.liked[i],1);
				}
			};

			ProviderService.favorites(fav);
    	}
    }


}]);