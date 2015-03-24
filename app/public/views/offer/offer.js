'use strict';

angular.module('app.offer', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/offer/:id', {
    templateUrl: 'views/offer/offer.html',
    controller: 'OfferCtrl'
  });
}])

.controller('OfferCtrl', ['$scope','$routeParams','$location','$timeout','ProviderService','AllService','AuthService','UploadService','$rootScope',function($scope,$routeParams,$location,$timeout,ProviderService,AllService,AuthService,UploadService,$rootScope) {
	ProviderService.offer($routeParams.id).success(buildOfferView);

	function buildOfferView(data, status, headers, config){
		$scope.offer = data;
		$scope.offer.offer.titleimage.black = $scope.offer.offer.titleimage.black.replace('public/','');
		$scope.offer.offer.titleimage.normal = $scope.offer.offer.titleimage.normal.replace('public/','');
	}

	$(window).bind('scroll', calcScroll);

	function calcScroll(event){
		var top = $(window).scrollTop();
		var perc = top / 300;
		if(top <= 300){
			var op = 1 - perc
			$('.normal_image').css('opacity',op)
		}
		
	}

}]);