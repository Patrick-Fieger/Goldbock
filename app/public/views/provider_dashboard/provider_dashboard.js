'use strict';

angular.module('app.provider_dashboard', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/provider/dashboard', {
    templateUrl: 'views/provider_dashboard/provider_dashboard.html',
    controller: 'ProviderDashboardCtrl'
  });
}])

.controller('ProviderDashboardCtrl', ['$scope','$location','$timeout','ProviderService','AllService','AuthService','UploadService','$rootScope',function($scope,$location,$timeout,ProviderService,AllService,AuthService,UploadService,$rootScope) {
	$scope.user = {};
	$scope.avatar;
	$scope.showAboutTextarea = false;
	$scope.editstate = false;
	$scope.hideAddOffer = false;
	$scope.passstate = false;
	$scope.showAboutTextareaText;
	$scope.about;
	$scope.count = 400;
	$scope.password = {};

	AllService.profile().success(updateProfileView);

	function updateProfileView(data, status, headers, config){
		$scope.user = data;

		if(data.offers.length >= 3){
			$scope.hideAddOffer = true
		}

		if (data.avatar !== undefined) {
        	$scope.user.avatar.big = data.avatar.big.replace('public/','')
        }
        else{
        	$scope.user.avatar = {};
        	$scope.user.avatar.big = 'img/avatar/avatar.png';
        }

        checkAboutText();
	}

	function checkAboutText(){
		if($scope.user.about !== undefined && $scope.user.about !== ""){
        	nltobr();
        }else{
        	$scope.showAboutTextareaText = false;
        }
	}

	function nltobr() {
		$scope.about = $scope.user.about.replace(/(?:\r\n|\r|\n)/g, '<br />');
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
		console.log($scope.pass.$valid)
		if($scope.userabout.$valid && $scope.userdata.$valid && $scope.editstate) {
			var data = angular.copy($scope.user);
       		ProviderService.updateProfile(data).success(updateProfileSuccess);
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
		AllService.updateName($scope.user.firstname + ' ' + $scope.user.lastname);
	}

	function changePasswordSuccess(){
		$scope.cancel();
	} 

	function updateAvatarsView(data, status, headers, config){
		$rootScope.avatar.small = data.small.replace('public/','');
		$scope.user.avatar.big = data.big.replace('public/','');
		$scope.cancelCrop();
	}

	$scope.countText = function(){
		$scope.count = 400 - $scope.user.about.length - ($scope.user.about.match(/\n/g)||[]).length;
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
		for(var i = 0; i < $scope.user.offers.length; i++) {
		    var obj = $scope.user.offers[i];
		    if( id == obj.id) {
		        $scope.user.offers.splice(i, 1);
		        $scope.hideAddOffer = false;
		    }
		}
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
}]);