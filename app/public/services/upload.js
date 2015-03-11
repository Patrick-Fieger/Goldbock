angular.module('app.uploadService', [])
.service('UploadService', function($http){
	var uploadOfferPhotos = function(files){
		var formData = new FormData();

		for (var i = 0; i < files.length; i++) {
			formData.append('files', files[i]);
		};
		
		return $http.post('/provider/upload/offer/images', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });	
	}

	var uploadOfferVideo = function(file){
		var formData = new FormData();
		formData.append('files', file);

		return $http.post('/provider/upload/offer/video', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });	
	}

	var progress = function(){
		return $http.get('/upload/progress')
	}

	return{
		uploadOfferPhotos : uploadOfferPhotos,
		uploadOfferVideo : uploadOfferVideo,
		progress : progress
	}
})