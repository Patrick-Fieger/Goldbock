'use strict';
angular.module('app.categories', ['ngRoute', 'ngAnimate']).config(['$routeProvider', '$animateProvider',
    function($routeProvider, $animateProvider) {
        $routeProvider.when('/categories', {
            templateUrl: 'views/categories/categories.html',
            controller: 'CategoriesCtrl'
        });
    }
]).controller('CategoriesCtrl', ['$scope', '$timeout','$location','$rootScope',
    function($scope, $timeout,$location,$rootScope) {

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