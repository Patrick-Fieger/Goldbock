'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
  'app.login',
  'app.userService',
  'app.authService',
  'myApp.view2',
  'myApp.view3',
  'ngSanitize',
  'ng-currency',
  'app.admin'
]).
config(['$locationProvider','$routeProvider','$animateProvider', function($locationProvider,$routeProvider,$animateProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}])
.run(function($rootScope,$http,AuthService) {
    $rootScope.$on('$routeChangeSuccess', function(ev, to, toParams, from, fromParams) {
        $('body').scrollTop(0);
        $('.spinner').removeClass('active');
        if(to.$$route.originalPath !== '/'){
            AuthService.isAuth();
        }
    });

    var u = '#/angebote/'

    $rootScope.kat = [{
            "name": "Gemeinsames / Verabreden",
            "id": "gemeinsames",
            "list": [
                {
                    "href": u+"kochen",
                    "title": "Kochen / Backen"
                },
                {
                    "href": u+"diskutieren",
                    "title": "Diskutieren"
                },
                {
                    "href": u+"aktivitaeten",
                    "title": "Aktivitäten"
                },
                {
                    "href": "/buchung",
                    "title": "Außerhaus Meeting"
                }
            ]
        }, {
            "name": "Wocheneinkauf",
            "id": "wocheneinkauf",
            "list": []
        }, {
            "name": "Home & Garden",
            "id": "haushalt",
            "list": [
                {
                    "href": u+"buegeln",
                    "title": "Bügeln"
                },
                {
                    "href": u+"schneider",
                    "title": "Schneider"
                },
                {
                    "href": u+"hausarbeit",
                    "title": "Hausarbeit"
                },
                {
                    "href": u+"babysitter",
                    "title": "Babysitter"
                },
                {
                    "href": u+"garten",
                    "title": "Garten"
                },
                {
                    "href": u+"energieundversicherungen",
                    "title": "Energie & Versicherungen"
                }

                
            ]
        }, {
            "name": "Gesundheit / Bewegung",
            "id": "gesundheit-bewegung",
            "list": [
                {
                    "href": u+"fitness",
                    "title": "Fitness"
                },
                {
                    "href": u+"massagen",
                    "title": "Massagen"
                },
                {
                    "href": u+"kosmetik",
                    "title": "Kosmetik"
                },
                {
                    "href": u+"ernaehrung",
                    "title": "Ernährung"
                },
                {
                    "href": u+"probeangebote",
                    "title": "Probeangebote"
                }
            ]
        }, {
            "name": "Schwarzes Brett Dies & Das",
            "id": "tauschen",
            "list": []
        },{
            "name": "My Assistant",
            "id": "hilfe",
            "list": []
        }, {
            "name": "Kurzurlaub & Tagesausflug",
            "id": "Urlaub",
            "list": []
        },
        {
            "name": "Fortschritt <br> Privat und Beruf",
            "id": "Fortschritt",
            "list": [
                {
                    "href":u+"coaches",
                    "title":"Coaches"
                },
                {
                    "href":u+"berater",
                    "title":"Berater"
                },
                {
                    "href":u+"therapeuten",
                    "title":"Therapeuten"
                },
                {
                    "href":u+"trainer",
                    "title":"Trainer"
                },

            ]
        },
        {
            "name": "Regionales",
            "id": "Regionales",
            "list": [
                {
                    "href": u+"unterhaltung",
                    "title": "Unterhaltung"
                },
                {
                    "href": u+"werbung",
                    "title": "Werbung"
                },
                {
                    "href": u+"kuenstler",
                    "title": "Künstler"
                },
                {
                    "href": u+"theater",
                    "title": "Theater"
                },
                {
                    "href": u+"geschaefte",
                    "title": "Schöne Geschäfte"
                },
                {
                    "href": u+"regionaleprodukte",
                    "title": "Regionale Produkte & Dienstleistungen"
                }
            ]
        }];

}).directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                scope.$evalAsync(attr.onFinishRender);
            }
        }
    }
});