'use strict';

angular.module('app.list', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/list', {
    templateUrl: 'views/list/list.html',
    controller: 'ListCtrl'
  });

}])

.controller('ListCtrl', ['$scope','$location','$timeout','AdminService',function($scope,$location,$timeout,AdminService) {
  AdminService.getProviders().success(function(){
    alert('jaaaaa')
  })
}]);