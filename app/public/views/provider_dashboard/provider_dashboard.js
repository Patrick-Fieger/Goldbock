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
	$scope.showAboutTextareaText;
	$scope.about;
	$scope.count = 400;

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
			var data = angular.copy($scope.user);
       		ProviderService.updateProfile(data).success(updateProfileSuccess)
     	}else{
     		alert('Bitte füllen sie alle notwendigen Felder aus!')
     	}
	}

	function updateProfileSuccess(){
		checkAboutText();
		$scope.cancel();
		AllService.updateName($scope.user.firstname + ' ' + $scope.user.lastname)
	}

	function checkSize(input){
		if (input[0].files[0] !== undefined) {
    	    var reader = new FileReader();
	
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

	$scope.logout = function(){
		AuthService.logout();
	}
}]);