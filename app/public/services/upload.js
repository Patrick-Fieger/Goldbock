angular.module('app.uploadService', [])
.service('UploadService', function($http){

	var uploadOfferTitleImage = function(file){
		var formData = new FormData();
		formData.append('files', file);

		return $http.post('/provider/upload/offer/title', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
	}

	var uploadOfferPhotos = function(files,index){
		var formData = new FormData();

		for (var i = 0; i < files.length; i++) {
			formData.append('files', files[i]);
		};

		formData.append('index', index);

		return $http.post('/upload/offer/images', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
	}

	var uploadOfferVideo = function(file,index){
		var formData = new FormData();
		formData.append('files', file);
		formData.append('index', index);

		return $http.post('/upload/offer/video', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
	}

	var clearProgress = function(){
		return $http.post('/clear/upload');
	}

	var uploadOfferData = function(data){
		return $http.post('/upload/offer/data',data)
	}

	var updateOfferData = function(data){
		return $http.post('/provider/edit/offer/data',data)
	}

	var deletePrevData = function(data){
		return $http.delete('/edit/offer',{params: data});
	}

	var progress = function(){
		return $http.get('/upload/progress')
	}

	var avatar = function(file){
		return $http.post('/update/avatar', file)
	}

	return{
		uploadOfferTitleImage : uploadOfferTitleImage,
		uploadOfferPhotos : uploadOfferPhotos,
		uploadOfferVideo : uploadOfferVideo,
		uploadOfferData : uploadOfferData,
		updateOfferData : updateOfferData,
		deletePrevData : deletePrevData,
		clearProgress : clearProgress,
		avatar : avatar,
		progress : progress
	}
})