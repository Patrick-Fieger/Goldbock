'use strict';

angular.module('app.verify_email', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/verify/email/:token', {
    templateUrl: 'views/verify_email/verify_email.html',
    controller: 'VerifyEmailCtrl'
  });
}])

.controller('VerifyEmailCtrl', ['$scope','$routeParams','$location','AuthService','MessageService',function($scope,$routeParams,$location,AuthService,MessageService) {
  AuthService.verifyEmail({token : $routeParams.token}).success(changeSuccess).error(changeFail);

	function changeSuccess(data, status, headers, config) {
    MessageService.info(1);
    $location.path('/');
  }

  function changeFail(data, status, headers, config) {
  	MessageService.danger(5);
  }
}]);