'use strict';

angular.module('app.provider_create_offer', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/provider/create/offer', {
    templateUrl: 'views/provider_create_offer/provider_create_offer.html',
    controller: 'ProviderCreateOfferCtrl'
  });
}])

.controller('ProviderCreateOfferCtrl', ['$scope','UploadService','$location','$timeout','MessageService','AuthService','ProviderService','$parse', function ($scope,UploadService,$location,$timeout,MessageService,AuthService,ProviderService,$parse) {

	var imagecopy = '<span class="btn btn-primary wd100 fl mt10 mb10 fileinput_hide">    Bild auswählen    <input class="images" onchange="angular.element(this).scope().checkImages(this)" placeholder="Bild auswählen" type="file" accept="image/*"/></span>';
	var video_prev;
	var images;
	var progressInterval;
	$scope.images = [];

	// HIDE SHOW SECTIONS
	$scope.show_allgemein = true;
	$scope.show_section_chooser = false;
	$scope.show_section = false;
	$scope.show_open_hours = false;
	$scope.show_order_form = false;
	$scope.showProgress = false;
	$scope.progressMessage = "";


	$scope.offer = {
		description : "<p>Beschreibung des Angebotes</p>",
		business_hours : false,
		title : "",
		hours : 1,
		order_form : [],
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
  		formatSubmit: 'HH:i'
	}

	var path;
	AuthService.isAdmin().success(function(data, status, headers, config){
		if(data.admin){
			path = "/list"
		}else{
			path = "/provider/dashboard"
		}
	});

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

	function hideAllAreas(){
		$scope.show_allgemein = false;
		$scope.show_section_chooser = false;
		$scope.show_section = false;
		$scope.show_open_hours = false;
		$scope.show_order_form = false;
	}


	$scope.backTo = function(section,show_alert){
		if(show_alert){
			if(confirm('Sind sie sicher das Sie den Vorgang abbrechen wollen?')){
				hideAllAreas();
				$parse(section).assign($scope, true);
			}
		}else{
			hideAllAreas();
			$parse(section).assign($scope, true);
		}
	}


	var fotos = {
		title : "",
		type : "fotos",
		fotos : []
	}

	var video = {
		title : "",
		type : "video",
		video : ""
	}

	var text = {
		title : "",
		type : "text",
		text : ""
	}


	$scope.section_holder;
	$scope.addNewSection = function(section){
		hideAllAreas();
		$scope.show_section = true;
		var s = section;
		if(s == "fotos"){
			$scope.section_holder = fotos;
		}else if(s == "video"){
			$scope.section_holder = video;
		}else{
			$scope.section_holder = text;
		}
	}

	$scope.saveSection = function(type){
		if($scope.section_holder.title !== ""){
			if(type == "fotos"){
				if(images.length !== 0){
					$scope.section_holder.fotos = images;
					addSection();
				}else{
					alert('Bitte fügen Sie Bilder hinzu!');
				}
			}else if(type == "video"){
				if(video_prev){
					$scope.section_holder.video = video_prev;
					addSection();
				}else{
					alert('Bitte fügen sie ein Video hinzu');
				}
			}else{
				if($scope.section_holder.text !== ""){
					addSection();
				}else{
					alert('Bitte fügen sie einen Text hinzu');
				}
			}
		}else{
			alert('Bitte füllen Sie den Titel des Bereichs aus!');
		}
	}

	function addSection(){
		$scope.offer.sections.push($scope.section_holder);
		$scope.backTo('show_allgemein');
		clearSection();
	}

	function clearSection(){
		video_prev = null;
		images = null;
		$scope.section_holder = {};
		$scope.images = [];
		fotos = {title : "",type : "fotos",fotos : []}
		video = {title : "",type : "video",video : ""}
		text = {title : "",type : "text",text : ""}
	}

	$scope.deleteSection = function(index){
		$scope.offer.sections.splice(index, 1);
	}

	$scope.deleteInputOderForm = function(index){
		$scope.offer.order_form.splice(index, 1);
	}

	$scope.editSection = function(index){
		hideAllAreas();
		$scope.show_section = true;
		$scope.section_holder = $scope.offer.sections[index];
	}


	$scope.cancelSection = function(){
		if(confirm('Sind sie sicher das Sie den Vorgang abbrechen wollen?')){
			$scope.backTo('show_allgemein');
			clearSection();
		}
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


	$scope.checkVideo = function(){
		video_prev = $("#video")[0].files[0];
		if (video_prev) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$('.video_preview').remove();
				$('#video').closest('span').after('<div class="video_preview wd100 fl mb10"><video class="wd100" src="'+ e.target.result +'" controls></video></div>');
			}
			reader.readAsDataURL(video_prev);
		}
	}


	$scope.input_form = "";
	$scope.addInputToForm = function(){
		if($scope.input_form !== ""){
			$scope.offer.order_form.push($scope.input_form);
			$scope.input_form = "";
		}
	}


	var fotos_index = 0;
	var video_index = 0;
	function checkImagesVideos(){
		for (var i = 0; i < $scope.offer.sections.length; i++) {
			if($scope.offer.sections[i].type == "fotos"){
				fotos_index++;
			}else if($scope.offer.sections[i].type == "video"){
				video_index++;
			}
		}
	}

	$scope.uploadForm = function(){

		checkImagesVideos();
		$timeout(function(){
			if(fotos_index !== 0){
				uploadImages();
			}else if(video_index !== 0){
				uploadVideos();
			}else{
				readyToSaveData();
			}

			$scope.watchProgress();
		},300);
	}

	function uploadImages(){
		for (var i = 0; i < $scope.offer.sections.length; i++) {
			if($scope.offer.sections[i].type == "fotos"){
				UploadService.uploadOfferPhotos($scope.offer.sections[i].fotos,i).success(pushImageFilenamesAndUploadVideo);
			}
		}
	}


	function pushImageFilenamesAndUploadVideo(data, status, headers, config){
		var d = data;
		fotos_index--;
		$scope.offer.sections[parseInt(d.index)].fotos = d.images;

		if(video_index == 0){
			readyToSaveData();
		}else{
			uploadVideos();
		}
	}

	function uploadVideos(){
		for (var i = 0; i < $scope.offer.sections.length; i++) {
			if($scope.offer.sections[i].type == "video"){
				UploadService.uploadOfferVideo($scope.offer.sections[i].video,i).success(pushVideoFilenamesAndUploadVideo);
			}
		}
	}

	function pushVideoFilenamesAndUploadVideo(data, status, headers, config){
		var d = data;
		video_index--;
		$scope.offer.sections[parseInt(d.index)].video = d.new;

		if(video_index == 0){
			readyToSaveData();
		}
	}


	function readyToSaveData(){
		if(fotos_index == 0 && video_index == 0){
			$timeout(function(){
				$('.progress-bar').width('75%');
				$scope.progressMessage = "Daten werden gespeichert";
				UploadService.uploadOfferData($scope.offer).success(uploadFinish)
			},1000)
		}
	}

	function uploadFinish(){
		$('.progress-bar').width('100%');
		watchProgressStop();
		$timeout(function(){
			MessageService.info(4)
			$location.path(path);
		},1000);
	}

	// PROGRESS

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

	function watchProgressStop() {
	    clearInterval(progressInterval);
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
