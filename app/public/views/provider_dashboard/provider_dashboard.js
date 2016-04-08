'use strict';

angular.module('app.provider_dashboard', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/provider/dashboard', {
    templateUrl: 'views/provider_dashboard/provider_dashboard.html',
    controller: 'ProviderDashboardCtrl'
  });
}])

.controller('ProviderDashboardCtrl', ['$scope','$location','$timeout','ProviderService','AllService','AuthService','UploadService','$rootScope','MessageService','socket',function($scope,$location,$timeout,ProviderService,AllService,AuthService,UploadService,$rootScope,MessageService,socket) {
	$scope.user = {};

	$timeout(function(){
		$('#posts').height($(window).height());
    });

	AllService.getOfferFromUser().success(updateProfileView);

	function updateProfileView(data, status, headers, config){
		$scope.offers = data;
	}

	$scope.redirectEdit = function(id){
		$location.path('/edit/' + id);
	}

	$scope.deleteOffer = function(id){
		if(confirm('Möchten sie das Angebot wirklich löschen?')){
			ProviderService.deleteOffer(id).success(updateOfferList)
		}
	}

	function updateOfferList(data, status, headers, config){
		var id = data;
		for(var i = 0; i < $scope.offers.length; i++) {
		    if( id == $scope.offers[i].id) {
		        $scope.offers.splice(i, 1);
		    }
		}
		MessageService.danger(3)
	}
}]);