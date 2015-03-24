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
		console.log(data)
	}

}]);