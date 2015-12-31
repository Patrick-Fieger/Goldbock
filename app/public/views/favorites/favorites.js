'use strict';

angular.module('app.favorites', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/favorites', {
    templateUrl: 'views/favorites/favorites.html',
    controller: 'FavoritesCtrl'
  });
}])

.controller('FavoritesCtrl', ['$scope','$location','AllService','ProviderService',function($scope,$location,AllService,ProviderService) {
	$scope.user = {};
	AllService.profile().success(updateProfileView);
	function updateProfileView(data, status, headers, config){
		console.log(data)
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