'use strict';

angular.module('app.admin', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/admin', {
    templateUrl: 'views/admin/admin.html'
  });
}])