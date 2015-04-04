'use strict';

angular.module('app.provider_edit_offer', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/edit/:id', {
    templateUrl: 'views/provider_edit_offer/provider_edit_offer.html',
    controller: 'ProviderEditOfferCtrl'
  });
}])

.controller('ProviderEditOfferCtrl', ['$scope','$routeParams','$location','$timeout','ProviderService','AllService','AuthService','UploadService','$rootScope',function($scope,$routeParams,$location,$timeout,ProviderService,AllService,AuthService,UploadService,$rootScope) {
	ProviderService.offer($routeParams.id).success(buildOfferView);

	var progressInterval;
	$scope.toggleTitleImage = false;
	$scope.togglePhotos = false;
	$scope.toggleVideo = false;
	$scope.images;
	var changed = -2;
	var anydelete = -2;
	var max;
	var title;
	var photos;

	$scope.delete = {
		id: "",
		titleimage : "",
		photos : [""],
		video : ""
	};

	$scope.uploadForm = function(){
		if(anydelete > 0){
			UploadService.deletePrevData($scope.delete).success(uploadNewFiles);	
		}else{
			uploadNewFiles();
		}
	}


	function uploadNewFiles(){
		if($("#titleimage")[0].files[0] !== undefined){
			UploadService.uploadOfferTitleImage($("#titleimage")[0].files[0]).success(pushTitleFilenameAndUploadImages);
		}else{
			pushTitleFilenameAndUploadImages("", "", "", "");
		}
	}


	function pushTitleFilenameAndUploadImages(data, status, headers, config){
		title = data;

		if($("#images")[0].files !== undefined){
			UploadService.uploadOfferPhotos($("#images")[0].files).success(pushImageFilenamesAndUploadVideo);
		}else{
			pushImageFilenamesAndUploadVideo("", "", "", "");
		}
	}


	function pushImageFilenamesAndUploadVideo(data, status, headers, config){
		photos = data;
		if($("#video")[0].files[0] !== undefined){
			UploadService.uploadOfferVideo($("#video")[0].files[0]).success(pushVideoFilenameAndUploadOfferData);
		}else{
			pushVideoFilenameAndUploadOfferData("","","","");	
		}
	}


	function pushVideoFilenameAndUploadOfferData(data, status, headers, config){
		watchProgressStop();
		$scope.new = {};
		$scope.new.id = $scope.offer.id;
		$scope.new.video = data;
		$scope.new.photos = photos;
		$scope.new.titleimage = title;
		$scope.new.description = $scope.offer.description;
		$scope.new.title = $scope.offer.title;
		$scope.new.price = $scope.offer.price;

		if($scope.new.video !== "" || $scope.new.photos !== "" || $scope.new.titleimage !== "" || changed > 0){
			$timeout(function(){
				$('.progress-bar').width('75%');
				$scope.progressMessage = "Daten werden gespeichert";
				UploadService.updateOfferData($scope.new).success(uploadFinish)
			},1000)
		}else{
			uploadFinish();
		}
	}

	function uploadFinish(){
		$('.progress-bar').width('100%');
		$timeout(function(){
			$location.path('/provider/dashboard');
		},1000);
	}

	function updateProgress(){
		UploadService.progress().success(function(data, status, headers, config){
			$('.progress-bar').width(data.progress + '%');
			$scope.progressMessage = data.message;
		})
	}


	function buildOfferView(data, status, headers, config){
		$scope.offer = data.offer;
		$scope.delete.id = data.offer.id
		
		if(data.offer.photos.length < 3){
			$scope.togglePhotos = true;
			max = 3 - data.offer.photos.length
		}
		if(data.offer.video == undefined && data.offer.video == ""){
			$scope.toggleVideo = true;
		}

		if(!data.isown){
			$location.path('/')
		}
	}


	$scope.toggleDelete = function(id,type){
		if(confirm('Wollen sie wirklich dieses Element löschen?')){
			if(type=="photos"){
				$scope.delete.photos.push(id)
			}else if(type=="titleimage"){
				$scope.delete[type] = $scope.titleimage;
			}else{
				$scope.delete[type] = id;
			}
			updateUploadView(id,type);
		}
	}

	function updateUploadView(id,type){
		if(type=="titleimage"){
			$('.images_preview_big_delete').remove();
			$('#titleimage').attr('required','true')
			$scope.toggleTitleImage = true;
		}else if(type == "photos"){
			for (var i = 0; i < $scope.offer.photos.length; i++) {
			    if ($scope.offer.photos[i] === id) {
			        $scope.offer.photos.splice(i, 1);
			        $scope.togglePhotos = true;
			        max = 3 - $scope.offer.photos.length;
			        if(max == 3){
			        	$('#images').attr('required','true')
			        }
			    }
			}
		}else{
			$('.video_preview_delete').remove();
			$scope.toggleVideo = true;
		}
	}

	$scope.checkImages = function(){
		$scope.images = [];
		var images = $("#images")[0].files;
		if($("#images")[0].files.length <= max){
			for (var i = 0; i < images.length; i++) {
				if (images && images[i]) {
					var reader = new FileReader();
					reader.onload = function (e) {
						$scope.$apply(function() {
							$scope.photosApplied = true;
							$scope.images.push(e.target.result)
						});
					}
					reader.readAsDataURL(images[i]);
				}
			};
    	}else{
    		alert('Sie können höchstens ' + max + ' Bild(er) auswählen');
    		var input = $("#images");
    		input.replaceWith(input.val('').clone(true));
    	}
	}

	$scope.checkTitleImage = function(){
		var image = $("#titleimage")[0].files[0];
		if (image) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$scope.$apply(function() {
					$scope.titleImageNew = e.target.result;
					$scope.headerImageApplied = true;
				});
			}
			reader.readAsDataURL(image);
		}
	}


	$scope.watchProgress = function() {
		$scope.showProgress = true;
		progressInterval = setInterval(function(){updateProgress()}, 10);
	}

	function watchProgressStop() {
	    clearInterval(progressInterval);
	}

	
	$scope.$watchGroup(['offer.description', 'offer.title','offer.price'], function(newValues, oldValues, scope) {
		changed++;
	});

	$scope.$watchGroup(['delete.titleimage','delete.video'] ,function(newValues, oldValues, scope) {
		anydelete++;
	},true);

	$scope.$watch('delete.photos' ,function(newValues, oldValues, scope) {
		anydelete++;
	},true)



	

}]);