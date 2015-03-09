'use strict';

angular.module('app.provider', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/provider', {
    templateUrl: 'views/provider/provider.html'
  });
}])