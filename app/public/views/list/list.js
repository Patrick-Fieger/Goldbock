'use strict';

angular.module('app.list', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/list', {
    templateUrl: 'views/list/list.html',
    controller: 'ListCtrl'
  });

}])

.controller('ListCtrl', ['$scope','$location','$timeout','AdminService','AllService',function($scope,$location,$timeout,AdminService,AllService) {
  $scope.list = {};

  AdminService.getProviders().success(function(data, status, headers, config){
    $scope.list.provider = data

    for (var i = 0; i < $scope.list.provider.length; i++) {
    	$scope.list.provider[i].countoffer = $scope.list.provider[i].offers.length
		$scope.list.provider[i].avatar.small = AllService.removePublicInLink($scope.list.provider[i].avatar.small)
    };
  });

  $scope.showDetails = function(e){
  	$(e.target).closest('li').toggleClass('active')
  	$(e.target).text(function(i, text){
	    return text === "Profil ansehen" ? "Profil verbergen" : "Profil ansehen";
	});
  }

  $scope.deleteUser = function(id){

  	alert(id)

  }


}]);