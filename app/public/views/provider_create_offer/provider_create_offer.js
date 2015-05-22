'use strict';

angular.module('app.provider_create_offer', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/provider/create/offer', {
    templateUrl: 'views/provider_create_offer/provider_create_offer.html',
    controller: 'ProviderCreateOfferCtrl'
  });
}])
.controller('ProviderCreateOfferCtrl', ['$scope','UploadService','$location','$timeout','MessageService', function ($scope,UploadService,$location,$timeout,MessageService) {
	var title;
	var photos;
	var imagecopy = $('.copyimage').html();
	var progressInterval;
	var images;
	
	$scope.showProgress = false;
	$scope.headerImageApplied = false;
	$scope.progressMessage = "";
	$scope.offer = {
		category : "Kochen / Backen",
		per : "pro Buchung"
	};

	$scope.uploadForm = function(){
		if($scope.images.length !== 0){
			UploadService.uploadOfferTitleImage($("#titleimage")[0].files[0]).success(pushTitleFilenameAndUploadImages);
		}else{
			alert('Bitte wählen sie mindestens ein Bild aus!')
		}
	}

	function pushTitleFilenameAndUploadImages(data, status, headers, config){
		title = data;
		UploadService.uploadOfferPhotos(images).success(pushImageFilenamesAndUploadVideo);
	}

	function pushImageFilenamesAndUploadVideo(data, status, headers, config){
		photos = data;
		if($("#video")[0].files[0] == undefined){
			pushVideoFilenameAndUploadOfferData("","","","");
		}else{
			UploadService.uploadOfferVideo($("#video")[0].files[0]).success(pushVideoFilenameAndUploadOfferData);	
		}
		
	}

	function pushVideoFilenameAndUploadOfferData(data, status, headers, config){
		watchProgressStop();
		$scope.offer.video = data;
		$scope.offer.photos = photos;
		$scope.offer.titleimage = title;
		$timeout(function(){
			$('.progress-bar').width('75%');
			$scope.progressMessage = "Daten werden gespeichert";
			UploadService.uploadOfferData($scope.offer).success(uploadFinish)
		},1000)
	}

	function uploadFinish(){
		$('.progress-bar').width('100%');
		$timeout(function(){
			MessageService.info(4)
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

	$scope.checkImages = function(that){
		$scope.images = [];
		images = [];
		$(".images").each(function(){
			images.push($(this)[0].files[0])
			$(this).attr('name',$(this)[0].files[0].name)
			$(this).closest('span').hide();
		}).promise().done(function(){
			$('.copyimage').append(imagecopy)
			for (var i = 0; i < images.length; i++) {
				var reader = new FileReader();
				reader.onload = function (e) {
					$scope.$apply(function() {
						$scope.images.push({
							data : e.target.result,
							name : ""
						});
						$timeout(function(){
							for (var i = 0; i < images.length; i++) {
								$scope.images[i].name = images[i].name 
							};
							console.log($scope.images)
						},400)
					});
				}
				reader.readAsDataURL(images[i]);
			};

		})
	}

	$scope.deleteImage = function(filename){
		if(confirm('Wollen sie wirklich dieses Bild löschen?')){
			$('input[name="'+filename+'"]').closest('span').remove();
			for (var i = 0; i < $scope.images.length; i++) {
				if($scope.images[i].name == filename){
					$scope.images.splice(i, 1);
				}
			};
		}
	}

	$scope.checkTitleImage = function(){
		var image = $("#titleimage")[0].files[0];
		if (image) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$scope.$apply(function() {
					$scope.titleImage = e.target.result;
					$scope.headerImageApplied = true;
				});
			}
			reader.readAsDataURL(image);
		}
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