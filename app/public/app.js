'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'angular-datepicker',
  'ngCkeditor',
  'ngSanitize',
  'ng-currency',
  'angularMoment',
  'app.login',
  'app.register',
  'app.forgot',
  'app.forgot_enter',
  'app.admin',
  'app.admin_provider',
  'app.admin_check_offer',
  'app.admin_edit_categories',
  'app.provider_create_offer',
  'app.provider_dashboard',
  'app.favorites',
  'app.categories',
  'app.circle',
  'app.provider_edit_offer',
  'app.offer',
  'app.offers',
  'app.verify_email',
  'app.list',
  'app.messageService',
  'app.userService',
  'app.authService',
  'app.photoService',
  'app.allService',
  'ngImgCrop',
  'app.uploadService',
  'app.adminService',
  'app.providerService',
  'app.chat',
  'app.profile'
]).
config(['$locationProvider','$routeProvider', function($locationProvider,$routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}])
.run(function($rootScope,$http,AuthService,AllService,$timeout,MessageService,amMoment) {
    amMoment.changeLocale('de');
    $rootScope.$on('$routeChangeSuccess', function(ev, to, toParams, from, fromParams) {
        var path = to.$$route.originalPath
        $(window).unbind("scroll");
        $('body').scrollTop(0);
        $('.spinner').removeClass('active');
        $('.container,#profile,#posts').height($(window).height());
        $rootScope.showmenu = false;
        clearInterval($rootScope.intervallAdvertisingSlider);
        if(path !== '/' && path !== "/register" && path.split('/')[1] !== "forgot" && path.split('/')[1] !== "verify"){
            AuthService.isAuth();
        }
    });

    $(document).on('click', '.disabled input', function(event) {
        event.preventDefault();
    });


    $(window).resize(function(event) {
      $('.container,#profile').height($(window).height());
    });

    // $rootScope.showmenu = false;


    // $rootScope.closeMenu = function(){
    //     $rootScope.showmenu = false;
    // }

    $rootScope.closeNotification = function(){
      MessageService.hideMessage();
    }
}).directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                scope.$evalAsync(attr.onFinishRender);
            }
        }
    }
}).directive("scroll", function ($window,$timeout,$routeParams) {
    return function(scope, element, attrs) {
        var left = "";
        setTimeout(function(){
            left = $('#pricing').parent('div').offset().left;
        },300)
        angular.element($window).bind("scroll", function() {
            var stickvar = $('.header_wrapper').height() - 40;

            if (this.pageYOffset >= stickvar) {
               $('#pricing').parent('div').css('left',left + 'px')
               scope.sticky = true;
            } else {
                $('#pricing').parent('div').removeAttr('style')
                scope.sticky = false;
            }
            scope.$apply();
        });
    };
}).directive('mapbox', [
    function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                callback: "="
            },
            template: '<div></div>',
            link: function (scope, element, attributes) {
                L.mapbox.accessToken = 'pk.eyJ1IjoiZ29sZGJvY2siLCJhIjoiNzIyZjZhMmQyMWU4M2RlY2I4NDQzNWY1ZWYwMTRhOTAifQ.MlC67JdU6PFNJHKKQhRp4w';
                var map = L.mapbox.map(element[0], 'goldbock.meoi9afp');
                map.dragging.disable();
                map.touchZoom.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();
                map.keyboard.disable();
                scope.callback(map);
            }
        };
    }
]).factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
}).directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
}).filter('reverse', function() {
  return function(items) {
    if(items)
        return items.slice().reverse();
  };
}).filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    })
.directive('starRating', function () {
    return {
        scope: {
            rating: '=',
            maxRating: '@',
            readOnly: '@',
            click: "&",
            mouseHover: "&",
            mouseLeave: "&"
        },
        restrict: 'EA',
        template:
            "<div style='display: inline-block; margin: 0px; padding: 0px; cursor:pointer;' ng-repeat='idx in maxRatings track by $index'> \
                    <img ng-src='{{((hoverValue + _rating) <= $index) && \"http://www.codeproject.com/script/ratings/images/star-empty-lg.png\" || \"http://www.codeproject.com/script/ratings/images/star-fill-lg.png\"}}' \
                    ng-Click='isolatedClick($index + 1)' \
                    ng-mouseenter='isolatedMouseHover($index + 1)' \
                    ng-mouseleave='isolatedMouseLeave($index + 1)'></img> \
            </div>",
        compile: function (element, attrs) {
            if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
                attrs.maxRating = '5';
            };
        },
        controller: function ($scope, $element, $attrs) {
            $scope.maxRatings = [];

            for (var i = 1; i <= $scope.maxRating; i++) {
                $scope.maxRatings.push({});
            };

            $scope._rating = $scope.rating;

      $scope.isolatedClick = function (param) {
        if ($scope.readOnly == 'true') return;

        $scope.rating = $scope._rating = param;
        $scope.hoverValue = 0;
        $scope.click({
          param: param
        });
      };

      $scope.isolatedMouseHover = function (param) {
        if ($scope.readOnly == 'true') return;

        $scope._rating = 0;
        $scope.hoverValue = param;
        $scope.mouseHover({
          param: param
        });
      };

      $scope.isolatedMouseLeave = function (param) {
        if ($scope.readOnly == 'true') return;

        $scope._rating = $scope.rating;
        $scope.hoverValue = 0;
        $scope.mouseLeave({
          param: param
        });
      };
        }
    };
});


// .directive("slider", function($timeout) {
//     function shuffle(o){
//         for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
//         return o;
//     }

//     return {
//         require: "ngModel",
//         restrict: "E",
//         replace: true,
//         scope: {
//             ngModel: "="
//         },
//         // template:
//         //     '<div ng-form="{{ subFormName }}">' +
//         //         '<input type="text" ng-model="from" class="range-from" />' +
//         //         '<input type="text" ng-model="to" class="range-to" />' +
//         //     '</div>',
//         link: function(scope,elem,attrs,ngModel) {
//             //var value = shuffle(ngModel.$modelValue)
//             console.log(scope)
//             $timeout(function(){
//               var copy = angular.copy(ngModel.$modelValue);

//               var value = shuffle(copy)
//               // ngModel.$viewValue = value;
//               // ngModel.$render();
//               // ngModel.$modelValue = value;
//               scope.ngModel = value;
//             },1000 * parseInt(attrs.slider));
//         }
//     };
// });
