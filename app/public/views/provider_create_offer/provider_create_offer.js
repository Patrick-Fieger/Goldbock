'use strict';

angular.module('app.provider_create_offer', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/provider/create/offer', {
    templateUrl: 'views/provider_create_offer/provider_create_offer.html',
    controller: 'ProviderCreateOfferCtrl'
  });
}])
.controller('ProviderCreateOfferCtrl', ['$scope','UploadService','$location','$timeout', function ($scope,UploadService,$location,$timeout) {
	var photos;
	var progressInterval;
	$scope.images = [];
	$scope.showProgress = false;
	$scope.progressMessage = "";
	$scope.offer = {}

	$scope.uploadForm = function(){
		UploadService.uploadOfferPhotos($("#images")[0].files).success(pushImageFilenamesAndUploadVideo);
	}

	function pushImageFilenamesAndUploadVideo(data, status, headers, config){
		photos = data;
		UploadService.uploadOfferVideo($("#video")[0].files[0]).success(pushVideoFilenameAndUploadOfferData);
	}

	function pushVideoFilenameAndUploadOfferData(data, status, headers, config){
		watchProgressStop();
		$scope.offer.video = data;
		$scope.offer.photos = photos;
		$timeout(function(){
			$('.progress-bar').width('75%');
			$scope.progressMessage = "Daten werden gespeichert";
			UploadService.uploadOfferData($scope.offer).success(uploadFinish)
		},1000)
		
	}

	function uploadFinish(){
		$('.progress-bar').width('100%');
		$timeout(function(){
			$location.path('/provider/dashboard');
		},1000);
	}

	$scope.watchProgress = function() {
		$scope.showProgress = true;
		progressInterval = setInterval(function(){updateProgress()}, 10);
	}

	function updateProgress(){
		UploadService.progress().success(function(data, status, headers, config){
			$('.progress-bar').width(data.progress + '%');
			$scope.progressMessage = data.message;
		})
	}

	$scope.checkImages = function(){
		$scope.images = [];
		var images = $("#images")[0].files;
		for (var i = 0; i < images.length; i++) {
			if (images && images[i]) {
        		var reader = new FileReader();
        		reader.onload = function (e) {
        			$scope.$apply(function() {
						$scope.images.push(e.target.result)
					});
        		}
        		reader.readAsDataURL(images[i]);
    		}
    	};
	}

	$scope.checkVideo = function(){
		var video = $("#video")[0].files[0];
		if (video) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$('.video_preview').remove();
				$('#video').closest('span').after('<div class="video_preview wd100 fl mb10"><video class="wd100" src="'+ e.target.result +'" controls></video></div>');
			}
			reader.readAsDataURL(video);
		}
	}

	function watchProgressStop() {
	    clearInterval(progressInterval);
	}
}])