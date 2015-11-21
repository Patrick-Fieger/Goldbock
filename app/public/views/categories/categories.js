'use strict';
angular.module('app.categories', ['ngRoute', 'ngAnimate']).config(['$routeProvider', '$animateProvider',
    function($routeProvider, $animateProvider) {
        $routeProvider.when('/categories', {
            templateUrl: 'views/categories/categories.html',
            controller: 'CategoriesCtrl'
        });
    }
]).controller('CategoriesCtrl', ['$scope', '$timeout','$location','$rootScope','UserService',
    function($scope, $timeout,$location,$rootScope,UserService) {
        $rootScope.intervallAdvertisingSlider = null;
        var descriptionMax = 124;


        UserService.categories().success(buildView)
        UserService.getAds().success(buildAds);

        function buildView (data, status, headers, config){
            $scope.categories = data;
            
        }

        function shuffle(o){
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }

        function buildAds(data, status, headers, config){
            $scope.ads = shuffle(data.ads);
            for (var i = 0; i < $scope.ads.length; i++) {
                if($scope.ads[i].description.length > descriptionMax){
                    $scope.ads[i].description = $scope.ads[i].description.substring(0, descriptionMax) + '...';
                }else{
                    $scope.ads[i].description = $scope.ads[i].description + '...';
                }
            };

            $rootScope.intervallAdvertisingSlider = setInterval(nextAd,10000);
        }

        function nextAd(){
            if($('.user_advertising li.active').next('li').length){
                $('.user_advertising li.active').removeClass('active').next('li').addClass('active');
            }else{
                $('.user_advertising li.active').removeClass('active');
                $('.user_advertising').find('li').eq(0).addClass('active');
            }
        }

        $scope.positioning = function() {
            var elems = $('.item')
            var increase = Math.PI * 2 / elems.size();
            var x = 0,
                y = 0,
                angle = 0,
                size = 250
                elems.each(function(index, el) {
                    x = size * Math.cos(angle) + 100;
                    y = size * Math.sin(angle) + 100;
                    $(this).css({
                        left: x + 'px',
                        top: y + 'px',
                    });
                    angle += increase;
                }).promise().done(function() {
                    elems.each(function(index, el) {
                        $timeout(function() {
                            $(el).addClass('active');
                        }, 100 * index);
                    });
                });
        }
    }
]);