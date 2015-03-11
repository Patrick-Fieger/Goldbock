'use strict';

angular.module('app.provider_create_offer', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/provider/create/offer', {
    templateUrl: 'views/provider_create_offer/provider_create_offer.html',
    controller: 'ProviderCreateOfferCtrl'
  });
}])
.controller('ProviderCreateOfferCtrl', ['$scope','UploadService', function ($scope,UploadService) {
	var photos, video;
	var progressInterval

	$scope.uploadForm = function(){
		UploadService.uploadOfferPhotos($("#images")[0].files).success(pushImageFilenamesAndUploadVideo);
	}

	function pushImageFilenamesAndUploadVideo(data, status, headers, config){
		photos = data;
		UploadService.uploadOfferVideo($("#video")[0].files[0]).success(pushVideoFilenameAndUploadOfferData);
	}

	function pushVideoFilenameAndUploadOfferData(data, status, headers, config){
		video = data;
		watchProgressStop();
	}

	$scope.watchProgress = function() {
		progressInterval = setInterval(function(){updateProgress()}, 10);
	}

	function updateProgress(){
		UploadService.progress().success(function(data, status, headers, config){
			console.log(data)
		})
	}

	function watchProgressStop() {
	    clearInterval(progressInterval);
	}
}])