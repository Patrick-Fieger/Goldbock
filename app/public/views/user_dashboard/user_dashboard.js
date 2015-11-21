'use strict';

angular.module('app.user_dashboard', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/user/dashboard', {
    templateUrl: 'views/user_dashboard/user_dashboard.html',
    controller: 'UserDashboardCtrl'
  });
}])

.controller('UserDashboardCtrl', ['$scope','$location','$timeout','UserService','AllService','AuthService','UploadService','$rootScope','MessageService','socket','ProviderService',function($scope,$location,$timeout,UserService,AllService,AuthService,UploadService,$rootScope,MessageService,socket,ProviderService) {
	$scope.user = {};
	AllService.profile().success(updateProfileView);
	function updateProfileView(data, status, headers, config){
		$scope.user = data;
	}
	
	$scope.deleteFav = function(id){
		if(confirm("Wollen sie diesen Favoriten wirklich löschen?")){
			var fav = {
				id : id,
				addOrRemove : true
			}
			
			for (var i = 0; i < $scope.user.liked.length; i++) {
				if($scope.user.liked[i].id == id){
					$scope.user.liked.splice($scope.user.liked[i],1);
				}
			};

			ProviderService.favorites(fav);
    	}
    }


}]);