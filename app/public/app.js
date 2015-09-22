'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
  'ngSanitize',
  'ng-currency',
  'angularMoment',
  'app.login',
  'app.register',
  'app.forgot',
  'app.forgot_enter',
  'app.admin',
  'app.admin_provider',
  'app.admin_edit_categories',
  'app.provider_create_offer',
  'app.provider_dashboard',
  'app.user_dashboard',
  'app.categories',
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
  'app.chat'
]).
config(['$locationProvider','$routeProvider','$animateProvider', function($locationProvider,$routeProvider,$animateProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}])
.run(function($rootScope,$http,AuthService,AllService,$timeout,MessageService,amMoment) {
    amMoment.changeLocale('de');
    
    $rootScope.$on('$routeChangeSuccess', function(ev, to, toParams, from, fromParams) {
        var path = to.$$route.originalPath
        $(window).unbind("scroll");
        $('body').scrollTop(0);
        $('.spinner').removeClass('active');

        if(path !== '/' && path !== "/register" && path.split('/')[1] !== "forgot" && path.split('/')[1] !== "verify"){
            AuthService.isAuth();
            AllService.checkAvatarInfos();
        }
    });

    $(document).on('click', '.disabled input', function(event) {
        event.preventDefault();
    });

    $rootScope.closeNotification = function(){
      MessageService.hideMessage();
    }

    // $rootScope.kat = [{
    //         "name": "Gemeinsames / Verabreden",
    //         "id": "gemeinsames",
    //         "list": [
    //             {
    //                 "href":  "kochen",
    //                 "title": "Kochen / Backen"
    //             },
    //             {
    //                 "href":  "diskutieren",
    //                 "title": "Diskutieren"
    //             },
    //             {
    //                 "href":  "aktivitaeten",
    //                 "title": "Aktivitäten"
    //             },
    //             {
    //                 "href": "/buchung",
    //                 "title": "Außerhaus Meeting"
    //             }
    //         ]
    //     }, {
    //         "name": "Wocheneinkauf",
    //         "id": "wocheneinkauf",
    //         "list": []
    //     }, {
    //         "name": "Schönes <br>&<br> Leckeres",
    //         "id": "schoenlecker",
    //         "list": [
    //             {
    //                 "href":  "region",
    //                 "title": "Aus der Region"
    //             },
    //             {
    //                 "href":  "stuffpicks",
    //                 "title": "Von Goldbock gewählt"
    //             }
    //         ]
    //     }, {
    //         "name": "Me & Service",
    //         "id": "service",
    //         "list": [
    //             {
    //                 "href":  "buegeln",
    //                 "title": "Bügeln"
    //             },
    //             {
    //                 "href":  "lesen",
    //                 "title": "Lesen"
    //             },
    //             {
    //                 "href":  "geschenke",
    //                 "title": "Geschenke"
    //             },
    //             {
    //                 "href":  "energievericherungen",
    //                 "title": "Energie & Versicherung"
    //             },
    //             {
    //                 "href":  "favorites",
    //                 "title": "My Favorites"
    //             },
    //             {
    //                 "href": "/myassi",
    //                 "title": "My Assistant"
    //             }
    //         ]
    //     }, {
    //         "name": "Schwarzes Brett Dies & Das",
    //         "id": "tauschen",
    //         "list": []
    //     },{
    //         "name": "Mettings",
    //         "id": "buchen",
    //         "list": []
    //     }, {
    //         "name": "Interessantes für's Business",
    //         "id": "business",
    //         "list": []
    //     },
    //     {
    //         "name": "Fortschritt <br> Privat und Beruf",
    //         "id": "fortschritt",
    //         "list": [
    //             {
    //                 "href": "coaches",
    //                 "title":"Coaches"
    //             },
    //             {
    //                 "href": "berater",
    //                 "title":"Berater"
    //             },
    //             {
    //                 "href": "therapeuten",
    //                 "title":"Therapeuten"
    //             },
    //             {
    //                 "href": "trainer",
    //                 "title":"Trainer"
    //             },
    //             {
    //                 "href": "spezial",
    //                 "title":"Spezial"
    //             }

    //         ]
    //     },
    //     {
    //         "name": "Kunst & Kultur",
    //         "id": "kunstkultur",
    //         "list": [
    //             {
    //                 "href":  "unterhaltung",
    //                 "title": "Unterhaltung"
    //             },

    //             {
    //                 "href":  "kuenstler",
    //                 "title": "Künstler"
    //             },
    //             {
    //                 "href":  "theater",
    //                 "title": "Theater"
    //             }
    //         ]
    //     }];
    

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
})