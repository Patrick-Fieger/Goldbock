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
  'app.provider_edit_offer',
  'app.offer',
  'app.verify_email',
  'app.messageService',
  'app.userService',
  'app.authService',
  'app.allService',
  'ngImgCrop',
  'app.uploadService',
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
});