'use strict';
angular.module('app.circle', ['ngRoute']).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/circle', {
            templateUrl: 'views/circle/circle.html',
            controller: 'CircleCtrl'
        });
    }
]).controller('CircleCtrl', ['$scope', '$timeout', '$location', '$rootScope', 'UserService', '$interval', '$sce',
    function($scope, $timeout, $location, $rootScope, UserService, $interval, $sce) {
        UserService.categories().success(buildView)

        function buildView(data, status, headers, config) {
            $scope.categories = data;
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