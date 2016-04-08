'use strict';
angular.module('app.categories', ['ngRoute']).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/categories', {
            templateUrl: 'views/categories/categories.html',
            controller: 'CategoriesCtrl'
        });
    }
]).controller('CategoriesCtrl', ['$scope', '$timeout','$location','$rootScope','UserService','$interval','$sce',
    function($scope, $timeout,$location,$rootScope,UserService,$interval,$sce) {
        var descriptionMax = 124;

        $timeout(function(){
            $('#posts').height($(window).height());
        });

        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }

        UserService.categories().success(buildView)
        UserService.getAds().success(buildAds);

        function buildView (data, status, headers, config){
            $scope.categories = data;
        }

        function shuffle(array) {
          var currentIndex = array.length, temporaryValue, randomIndex;

          // While there remain elements to shuffle...
          while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
          }

          return array;
        }

        function buildAds(data, status, headers, config){
            $scope.ads = shuffle(data.ads);
            $scope.allAds_1 = shuffle(angular.copy(data.all_ads));
            $scope.allAds_2 = shuffle(angular.copy(data.all_ads));
            $scope.allAds_3 = shuffle(angular.copy(data.all_ads));
            $scope.allAds_4 = shuffle(angular.copy(data.all_ads));
            $scope.allAds_5 = shuffle(angular.copy(data.all_ads));

            initSliders()

            // for (var i = 0; i < $scope.ads.length; i++) {
            //     if($scope.ads[i].description.length > descriptionMax){
            //         $scope.ads[i].description = $scope.ads[i].description.substring(0, descriptionMax) + '...';
            //     }else{
            //         $scope.ads[i].description = $scope.ads[i].description + '...';
            //     }
            // };

            // $rootScope.intervallAdvertisingSlider = setInterval(nextAd,10000);
        }

        function initSliders(){
            $('[slider]').each(function(index, el) {
                var that = $(this)

                $timeout(function(){
                    $interval(function(){
                        if(that.find('li.active').next('li').length){
                            that.find('li.active').removeClass('active').next('li').addClass('active');
                        }else{
                            that.find('li.active').removeClass('active');
                            that.find('li').eq(0).addClass('active');
                        }
                    },5000)

                },500*index)
            });


        }

        function nextAd(){
            if($('.user_advertising li.active').next('li').length){
                $('.user_advertising li.active').removeClass('active').next('li').addClass('active');
            }else{
                $('.user_advertising li.active').removeClass('active');
                $('.user_advertising').find('li').eq(0).addClass('active');
            }
        }
    }
]);