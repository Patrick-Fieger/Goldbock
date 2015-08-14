'use strict';
angular.module('app.offers', ['ngRoute', 'ngAnimate']).config(['$routeProvider', '$animateProvider',
    function($routeProvider, $animateProvider) {
        $routeProvider.when('/offers/:id', {
            templateUrl: 'views/offers/offers.html',
            controller: 'OffersCtrl'
        });
    }
]).controller('OffersCtrl', ['$scope', '$timeout','$location','$rootScope','$routeParams','UserService',
    function($scope, $timeout,$location,$rootScope,$routeParams,UserService) {
        var id = $routeParams.id

        UserService.categories().success(buildView)


        function buildView (data, status, headers, config){
            for (var i = 0; i < data.length; i++) {
                 if(data[i].href == id){
                    $scope.cat = data[i]
                    console.log($scope.cat)
                 }
                 
             };
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