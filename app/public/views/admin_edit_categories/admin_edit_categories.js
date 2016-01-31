'use strict';

angular.module('app.admin_edit_categories', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/categories/edit', {
    templateUrl: 'views/admin_edit_categories/admin_edit_categories.html',
    controller: 'AdminEditCategoriesCtrl'
  });
}])

.controller('AdminEditCategoriesCtrl', ['MessageService','UserService','$scope','AdminService',function(MessageService,UserService,$scope,AdminService) {
	$scope.categories;
	UserService.categories().success(buildView)

	function buildView(data, status, headers, config){
		$scope.categories = data;
	}



	$scope.addSub = function(e,id){
		if (isEnter(e)){
			e.preventDefault();
			for (var i = 0; i < $scope.categories.length; i++) {
				if($scope.categories[i].id === id)
					if($scope.categories[i].subcategory.indexOf(e.target.value) < 0){
						$scope.categories[i].subcategory.push(e.target.value)
						e.target.value = ""
					}else{
						alert('Diese Kategorie existiert bereits!')
					}
			};
		}
	}

	$scope.addMain = function(e){
		if (isEnter(e)){
			e.preventDefault();
			var data = {
				"id" : null,
				"category" : e.target.value,
				"subcategory" : [],
				"href" : null
			}
			$scope.categories.push(data)
			e.target.value = ""
		}
	}

	function isEnter(e){
		return e.which === 13 && e.target.value !== ""
	}


	$scope.deleteMain = function(id,name){
		for (var i = 0; i < $scope.categories.length; i++) {
			if(id && $scope.categories[i].id == id){
				$scope.categories.splice(i,1)
			}else if($scope.categories[i].category == name && $scope.categories[i].id == null){
				$scope.categories.splice(i,1)
			}
		};
	}

	$scope.deleteSub = function(subcategory,id){
		for (var i = 0; i < $scope.categories.length; i++) {
			for (var k = 0; k < $scope.categories[i].subcategory.length; k++) {
				if($scope.categories[i].subcategory[k] == subcategory && id && $scope.categories[i].id == id){
					$scope.categories[i].subcategory.splice(k,1)
				}else if($scope.categories[i].subcategory[k] == subcategory && $scope.categories[i].id == null){
					$scope.categories[i].subcategory.splice(k,1)
				}
			};
		};
	}


	$scope.updateSub = function (cat,index,val) {
		for (var i = 0; i < $scope.categories.length; i++) {
			if(cat == $scope.categories[i].category){
				$scope.categories[i].subcategory[index] = val;
			}
		};
	}


	$scope.updateMain = function(index,val){
		$scope.categories[index].category = val;
	}

	$scope.saveCategories = function(){
		AdminService.saveCategories($scope.categories).success(MessageService.info(7))
	}




}]);