'use strict';

angular.module('app.list', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/list', {
    templateUrl: 'views/list/list.html',
    controller: 'ListCtrl'
  });

}])

.controller('ListCtrl', ['$scope','$location','$timeout','AdminService','AllService','MessageService','ProviderService',function($scope,$location,$timeout,AdminService,AllService,MessageService,ProviderService) {
  $scope.list = {};

  AdminService.getProviders().success(buildProviderView);
  AdminService.getUsers().success(buildUserView);




  function buildProviderView(data, status, headers, config){
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
    AdminService.getOffers().success(checkOffers);
  };

  function checkOffers(data, status, headers, config){
    for (var i = 0; i < data.length; i++) {
      for (var k = 0; k < $scope.list.provider.length; k++) {
        if(data[i].creatorId == $scope.list.provider[k].id){
          $scope.list.provider[k].offers.push(data[i])
        }
      }
    }
  }

  function buildUserView(data, status, headers, config){
    $scope.list.user = data

    for (var i = 0; i < $scope.list.user.length; i++) {
      // $scope.list.user[i].countoffer = $scope.list.user[i].offers.length

      if($scope.list.user[i].avatar !== undefined){
        $scope.list.user[i].avatar.small = AllService.removePublicInLink($scope.list.user[i].avatar.small)
      }else{
        $scope.list.user[i].avatar = {}
        $scope.list.user[i].avatar.small = '/img/avatar/avatar.png'
      }
    };

  };



  $scope.sendNewData = function(data){
    console.log(data)
    AdminService.updateProfile(data).success(MessageService.info(6))
  }

  $scope.showDetails = function(e){
  	$(e.target).closest('li').toggleClass('active')
  	$(e.target).text(function(i, text){
	    return text === "Profil ansehen" ? "Profil verbergen" : "Profil ansehen";
	});
  }

  $scope.deleteUser = function(email,text,role){
    if(confirm("Wollen Sie diesen Nutzer wirklich "+text+"?")){
      AdminService.toggleActivate({email : email,role : role})

      if(role == 'provider'){
        for (var i = 0; i < $scope.list.provider.length; i++) {
          if(email == $scope.list.provider[i].email){
            if($scope.list.provider[i].deactivated == undefined){
              $scope.list.provider[i].deactivated = true;
            }else{
              $scope.list.provider[i].deactivated = !$scope.list.provider[i].deactivated;
            }
          }
        };
      }else{
        for (var i = 0; i < $scope.list.user.length; i++) {
          if(email == $scope.list.user[i].email){
            if($scope.list.user[i].deactivated == undefined){
              $scope.list.user[i].deactivated = true;
            }else{
              $scope.list.user[i].deactivated = !$scope.list.user[i].deactivated;
            }
          }
        };
      }
    }
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