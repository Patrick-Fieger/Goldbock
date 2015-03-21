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
	$scope.showAboutTextareaText;
	$scope.editData;

	AllService.profile().success(updateProfileView)

	function updateProfileView(data, status, headers, config){
		$scope.user = data;
		$scope.editData = data;


		if (data.avatar !== undefined) {
        	$scope.user.avatar.big = data.avatar.big.replace('public/','')
        }
        else{
        	$scope.user.avatar.big = 'img/avatar/avatar.png';
        }

        if(data.about !== undefined || data.about !== ""){
        	$scope.showAboutTextareaText = false;
        }else{
        	$scope.editData.about = "";
        	$scope.showAboutTextareaText = true;
        }
	}

	$scope.checkAvatar = function($event){
		checkSize($('#avatar'))
	}

	$scope.edit = function(){
		$scope.showAboutTextarea = true;
		$scope.editstate = true;
	}

	$scope.cancel = function(){
		$scope.showAboutTextarea = false;
		$scope.editstate = false;
	}

	$scope.save = function(){
		if($scope.userabout.$valid && $scope.userdata.$valid) {
			var data = angular.copy($scope.editData);
       		ProviderService.updateProfile(data).success(updateProfileSuccess)
     	}else{
     		alert('Bitte füllen sie alle notwendigen Felder aus!')
     	}
	}


	function updateProfileSuccess(){
		if($scope.editData.about !== ""){
			$scope.showAboutTextareaText = false;	
		}
		$scope.user = $scope.editData;
		$scope.cancel();
	}

	function checkSize(input){
		if (input[0].files[0] !== undefined) {
    	    var reader = new FileReader();
    	    var isOk = false
	
    	    reader.onload = function (e) {
    			var image = new Image();
				image.src = e.target.result;
				image.onload = function() {
				    if(this.width == this.height && this.width >= 200){
				    	UploadService.avatar(input[0].files[0]).success(updateAvatarsView)
				    }else{
				    	alert('Das Profilbild muss quadratisch und größer als 200px sein.')
				    }
				};
    	    }
    	    reader.readAsDataURL(input[0].files[0]);
    	}
	}

	function updateAvatarsView(data, status, headers, config){
		$rootScope.avatar.small = data.small.replace('public/','');
		$scope.user.avatar.big = data.big.replace('public/','');
	}


	$scope.logout = function(){
		AuthService.logout();
	}
}]);