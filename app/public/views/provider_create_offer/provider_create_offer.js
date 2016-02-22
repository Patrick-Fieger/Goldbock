'use strict';

angular.module('app.provider_create_offer', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/provider/create/offer', {
    templateUrl: 'views/provider_create_offer/provider_create_offer.html',
    controller: 'ProviderCreateOfferCtrl'
  });
}])

.controller('ProviderCreateOfferCtrl', ['$scope','UploadService','$location','$timeout','MessageService','AuthService','ProviderService', function ($scope,UploadService,$location,$timeout,MessageService,AuthService,ProviderService) {

	$scope.custom_content_index = 0;

	$scope.offer = {
		description : "<p>Beschreibung des Angebotes</p>",
		business_hours : false,
		sections : [],
		times : [
			{
				day : "Montag",
				open : false,
				from : "",
				to : ""
			},
			{
				day : "Dienstag",
				open : false,
				from : "",
				to : ""
			},
			{
				day : "Mittwoch",
				open : false,
				from : "",
				to : ""
			},
			{
				day : "Donnerstag",
				open : false,
				from : "",
				to : ""
			},
			{
				day : "Freitag",
				open : false,
				from : "",
				to : ""
			},
			{
				day : "Samstag",
				open : false,
				from : "",
				to : ""
			},
			{
				day : "Sonntag",
				open : false,
				from : "",
				to : ""
			}
		]
	};

	$scope.timepickeroptions = {
  		format: 'HH:i U!hr',
  		formatSubmit: 'HH:i U!hr'
	}


	$timeout(function() {
		CKEDITOR.instances.editor1.setData($scope.offer.description);
	}, 1000);

	ProviderService.categories().success(buildCategories);
	function buildCategories(data, status, headers, config){
		$scope.categories = data

		$scope.offer.category = data[0].subcategory[0];
		$scope.offer.per = "pro Buchung";
	}

	$scope.changeBusiness = function(bool){
		$scope.offer.business_hours = bool;
	}

	$scope.changeOpening = function(index){
		$scope.offer.times[index].open = !$scope.offer.times[index].open;
	}



	$scope.editorOptions = {
    	language: 'de',
    	toolbar :[
			{ name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates' ] },
			{ name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
			{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ], items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
			{ name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
			'/',
			{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic'] },
			{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: ['BulletedList', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
			{ name: 'links', items: [ 'Link', 'Unlink'] },
			{ name: 'insert', items: ['Table'] },
			'/',
			{ name: 'styles', items: ['Format', 'Font', 'FontSize' ] }
		]
	};




}]);

// .controller('ProviderCreateOfferCtrl', ['$scope','UploadService','$location','$timeout','MessageService','AuthService','ProviderService', function ($scope,UploadService,$location,$timeout,MessageService,AuthService,ProviderService) {
// 	var title;
// 	var photos;
// 	var imagecopy = $('.copyimage').html();
// 	var progressInterval;
// 	var images;
// 	$scope.images = [];

// 	$scope.showProgress = false;
// 	$scope.headerImageApplied = false;
// 	$scope.progressMessage = "";

// 	var path;
// 	AuthService.isAdmin().success(function(data, status, headers, config){
// 		if(data.admin){
// 			path = "/list"
// 		}else{
// 			path = "/provider/dashboard"
// 		}
// 	});

// 	ProviderService.categories().success(buildCategories)


// 	function buildCategories(data, status, headers, config){
// 		$scope.categories = data

// 		$scope.offer = {
// 			category : data[0].subcategory[0],
// 			per : "pro Buchung"
// 		};
// 	}

// 	$scope.uploadForm = function(){
// 		if($scope.images.length !== 0){
// 			$scope.watchProgress();
// 			UploadService.uploadOfferTitleImage($("#titleimage")[0].files[0]).success(pushTitleFilenameAndUploadImages);
// 		}else{
// 			alert('Bitte wählen sie mindestens ein Bild aus!')
// 		}
// 	}

// 	function pushTitleFilenameAndUploadImages(data, status, headers, config){
// 		title = data;
// 		UploadService.uploadOfferPhotos(images).success(pushImageFilenamesAndUploadVideo);
// 	}

// 	function pushImageFilenamesAndUploadVideo(data, status, headers, config){
// 		photos = data;
// 		if($("#video")[0].files[0] == undefined){
// 			pushVideoFilenameAndUploadOfferData("","","","");
// 		}else{
// 			UploadService.uploadOfferVideo($("#video")[0].files[0]).success(pushVideoFilenameAndUploadOfferData);
// 		}

// 	}

// 	function pushVideoFilenameAndUploadOfferData(data, status, headers, config){
// 		watchProgressStop();
// 		$scope.offer.video = data;
// 		$scope.offer.photos = photos;
// 		$scope.offer.titleimage = title;
// 		$timeout(function(){
// 			$('.progress-bar').width('75%');
// 			$scope.progressMessage = "Daten werden gespeichert";
// 			UploadService.uploadOfferData($scope.offer).success(uploadFinish)
// 		},1000)
// 	}

// 	function uploadFinish(){
// 		$('.progress-bar').width('100%');
// 		$timeout(function(){
// 			MessageService.info(4)
// 			$location.path(path);
// 		},1000);
// 	}

// 	$scope.watchProgress = function() {
// 		$scope.showProgress = true;
// 		progressInterval = setInterval(function(){updateProgress()}, 10);
// 	}

// 	function updateProgress(){
// 		UploadService.progress().success(function(data, status, headers, config){
// 			$('.progress-bar').width(data.progress + '%');
// 			$scope.progressMessage = data.message;
// 		})
// 	}

// 	$scope.checkImages = function(that){
// 		$scope.images = [];
// 		images = [];
// 		$(".images").each(function(){
// 			images.push($(this)[0].files[0])
// 			$(this).attr('name',$(this)[0].files[0].name)
// 			$(this).closest('span').hide();
// 		}).promise().done(function(){
// 			$('.copyimage').append(imagecopy)
// 			for (var i = 0; i < images.length; i++) {
// 				var reader = new FileReader();
// 				reader.onload = function (e) {
// 					$scope.$apply(function() {
// 						$scope.images.push({
// 							data : e.target.result,
// 							name : ""
// 						});
// 						$timeout(function(){
// 							for (var i = 0; i < images.length; i++) {
// 								$scope.images[i].name = images[i].name
// 							};
// 							console.log($scope.images)
// 						},400)
// 					});
// 				}
// 				reader.readAsDataURL(images[i]);
// 			};

// 		})
// 	}

// 	$scope.deleteImage = function(filename){
// 		if(confirm('Wollen sie wirklich dieses Bild löschen?')){
// 			$('input[name="'+filename+'"]').closest('span').remove();
// 			for (var i = 0; i < $scope.images.length; i++) {
// 				if($scope.images[i].name == filename){
// 					$scope.images.splice(i, 1);
// 				}
// 			};
// 		}
// 	}

// 	$scope.checkTitleImage = function(){
// 		var image = $("#titleimage")[0].files[0];
// 		if (image) {
// 			var reader = new FileReader();
// 			reader.onload = function (e) {
// 				$scope.$apply(function() {
// 					$scope.titleImage = e.target.result;
// 					$scope.headerImageApplied = true;
// 				});
// 			}
// 			reader.readAsDataURL(image);
// 		}
// 	}

// 	$scope.checkVideo = function(){
// 		var video = $("#video")[0].files[0];
// 		if (video) {
// 			var reader = new FileReader();
// 			reader.onload = function (e) {
// 				$('.video_preview').remove();
// 				$('#video').closest('span').after('<div class="video_preview wd100 fl mb10"><video class="wd100" src="'+ e.target.result +'" controls></video></div>');
// 			}
// 			reader.readAsDataURL(video);
// 		}
// 	}

// 	function watchProgressStop() {
// 	    clearInterval(progressInterval);
// 	}
// }])