'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
  'ngSanitize',
  'ng-currency',
  'app.login',
  'app.register',
  'app.forgot',
  'app.forgot_enter',
  'app.admin',
  'app.admin_provider',
  'app.provider_create_offer',
  'app.provider_dashboard',
  'app.user_dashboard',
  'app.provider_edit_offer',
  'app.offer',
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
  'app.providerService'
]).
config(['$locationProvider','$routeProvider','$animateProvider', function($locationProvider,$routeProvider,$animateProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}])
.run(function($rootScope,$http,AuthService,AllService,$timeout,MessageService) {
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
]);