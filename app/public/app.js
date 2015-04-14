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
  'app.admin',
  'app.admin_provider',
  'app.provider_create_offer',
  'app.provider_dashboard',
  'app.provider_edit_offer',
  'app.offer',
  'app.userService',
  'app.authService',
  'app.allService',
  'app.uploadService',
  'app.providerService'
]).
config(['$locationProvider','$routeProvider','$animateProvider', function($locationProvider,$routeProvider,$animateProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}])
.run(function($rootScope,$http,AuthService,AllService,$timeout) {
    $rootScope.$on('$routeChangeSuccess', function(ev, to, toParams, from, fromParams) {
        var path = to.$$route.originalPath
        $(window).unbind("scroll");
        $('body').scrollTop(0);
        $('.spinner').removeClass('active');
        if(path !== '/' && path !== "/register" && path !== "/forgot"){
            AuthService.isAuth();
            AllService.checkAvatarInfos();
        }
    });

    $(document).on('click', '.disabled input', function(event) {
        event.preventDefault();
    });

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