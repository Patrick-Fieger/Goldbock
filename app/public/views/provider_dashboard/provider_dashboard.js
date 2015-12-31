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

	AllService.profile().success(updateProfileView);

	function updateProfileView(data, status, headers, config){
		$scope.user = data;
		if(data.offers){
			if(data.offers.length >= 3){
				$scope.hideAddOffer = true
			}
		}
	}


	$scope.redirectEdit = function(id){
		$location.path('/edit/'+id)
	}

	$scope.deleteOffer = function(id){
		if(confirm('Möchten sie das Angebot wirklich löschen?')){
			ProviderService.deleteOffer(id).success(updateOfferList)
		}
	}

	function updateOfferList(data, status, headers, config){
		var id = data;
		for(var i = 0; i < $scope.user.offers.length; i++) {
		    var obj = $scope.user.offers[i];
		    if( id == obj.id) {
		        $scope.user.offers.splice(i, 1);
		        $scope.hideAddOffer = false;
		    }
		}
		MessageService.danger(3)
	}
}]);