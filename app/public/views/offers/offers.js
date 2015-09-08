'use strict';
angular.module('app.offers', ['ngRoute', 'ngAnimate']).config(['$routeProvider', '$animateProvider',
    function($routeProvider, $animateProvider) {
        $routeProvider.when('/offers/:id', {
            templateUrl: 'views/offers/offers.html',
            controller: 'OffersCtrl'
        });
    }
]).controller('OffersCtrl', ['$scope', '$timeout','$location','$rootScope','$routeParams','UserService','MessageService',
    function($scope, $timeout,$location,$rootScope,$routeParams,UserService,MessageService) {
        var id = $routeParams.id
        $scope.category = "Alle";
        UserService.categories().success(buildCategories)


        function buildCategories (data, status, headers, config){
            for (var i = 0; i < data.length; i++) {
                 if(data[i].href == id){
                    $scope.cat = data[i]
                 }
             };
        }

        UserService.alloffers().success(buildOffers)

        function buildOffers (data, status, headers, config){
            $scope.offers = data;

            console.log(data)
        }

        $scope.checkCat = function(){
            if($scope.category == "Außerhaus Meeting"){
                $scope.showmeeting = true
            }else{
                $scope.showmeeting = false
            }
        }

        $('.datepicker').pickadate(
            {
                today: '',
                clear: '',
                close: '',
                min:true,
                onOpen: function() {
                  //console.log('Opened up')
                },
                onClose: function() {
                  //console.log('Closed now')
                }
            }
        );

        $scope.submitMeeting = function(){
            MessageService.info(8)
        }

        // for (var i = 0; i < $rootScope.kat.length; i++) {
        //     if($rootScope.kat[i].id == $routeParams.id){
        //         $scope.title = $rootScope.kat[i].name;

        //         if($rootScope.kat[i].list.length !== 0){
        //             $scope.list = $rootScope.kat[i].list
        //         }

        //     }
        // };
    }
]);