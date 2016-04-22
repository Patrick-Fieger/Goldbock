'use strict';

angular.module('app.admin_check_offer', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/check/offer', {
    templateUrl: 'views/admin_check_offer/admin_check_offer.html',
    controller: 'AdminCheckOfferCtrl'
  });
}])

.controller('AdminCheckOfferCtrl', ['AdminService','$scope',function(AdminService,$scope) {
	AdminService.getOffers().success(buildView)


	function buildView(data){
		$scope.offers = data
	}
}]);