'use strict';

angular.module('app.list', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/list', {
    templateUrl: 'views/list/list.html',
    controller: 'ListCtrl'
  });

}])

.controller('ListCtrl', ['$scope','$location','$timeout','AdminService','AllService','MessageService','ProviderService',function($scope,$location,$timeout,AdminService,AllService,MessageService,ProviderService) {
  $scope.list = {};

  AdminService.getProviders().success(function(data, status, headers, config){
    $scope.list.provider = data

    for (var i = 0; i < $scope.list.provider.length; i++) {
    	$scope.list.provider[i].countoffer = $scope.list.provider[i].offers.length

      if($scope.list.provider[i].avatar !== undefined){
        $scope.list.provider[i].avatar.small = AllService.removePublicInLink($scope.list.provider[i].avatar.small)  
      }else{
        $scope.list.provider[i].avatar = {}
        $scope.list.provider[i].avatar.small = '/img/avatar/avatar.png'
      }

		  
    };

  });

  $scope.sendNewData = function(data){
    AdminService.updateProfile(data).success(MessageService.info(6))
  }

  $scope.showDetails = function(e){
  	$(e.target).closest('li').toggleClass('active')
  	$(e.target).text(function(i, text){
	    return text === "Profil ansehen" ? "Profil verbergen" : "Profil ansehen";
	});
  }

  $scope.deleteUser = function(id){
  	alert(id)
  }

  $scope.redirectToOfferSetCookie = function(email){
    $.cookie('email',email);
    $location.path('/provider/create/offer')
  }

  $scope.redirectEdit = function(id){
    $location.path('/edit/'+id)
  }

  $scope.deleteOffer = function(id,ev){
    if(confirm('Möchten sie das Angebot wirklich löschen?')){
      ProviderService.deleteOffer(id).success(function(){
        $(ev.target).closest('li').remove()
      });
    }
  }

}]);