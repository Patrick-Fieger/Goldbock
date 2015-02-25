'use strict';

angular.module('myApp.view3', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/angebote/:kat', {
    templateUrl: 'views/view3/view3.html',
    controller: 'View3Ctrl'
  });
}])

.controller('View3Ctrl', ['$scope','$timeout','$routeParams','$rootScope',
	function($scope,$timeout,$routeParams,$rootScope) {
	var kat = localStorage.getItem('kat');
	var obj = $rootScope.kat;
	var param = $routeParams.kat;
	$scope.enabled = ['erlaubt','nicht gestattet','begrenzt'];
	$scope.showOwnDate = 1;
	$scope.package_ = 29;
	$scope.anteil = 30;
	$scope.pricefromuser = 0.00;

	function initpicker (){
		$('.timepicker').pickatime({
			format: 'H:i',
			clear: '',
  			min: [8,0],
  			max: [18,0]
		});

		$('.datepicker').pickadate(
            {
                today: '',
                clear: '',
                close: '',
                disable: [
        			6,7
    			],
                min:true
            }
        );

        $(".fancybox").fancybox({
        	maxWidth	: 800,
			maxHeight	: 600,
			fitToView	: false,
			width		: '70%',
			height		: '70%'
        });

	}

	for (var prop in obj) {
		if(obj[prop].id == kat){
			for (var list in obj[prop].list) {
				if(obj[prop].list[list].href.indexOf(param) > -1){
					$scope.heading=obj[prop].list[list].title
				}
			}
		}
   }

   if(kat == 'tauschen'){
   	$scope.heading = "Schwarzes Brett"
   	$scope.isSchwarzesBrett = true
   }else{
   	$scope.isSchwarzesBrett = false
   }

	$timeout(function(){
		$('.angebote li').each(function(index, el) {
			$timeout(function(){
				$(el).addClass('active');
			},100*index);
		});
	},300)

	$scope.sendRequest = function(){
		$('.closeangebot').trigger('click');
		$timeout(function(){
			$('body').showNoti('Ihre Anfrage wurde versendet und wird von unseren Mitarbeitern bearbeitet!')
		},400)
	}

	$scope.sendAnzeige = function () {
		$('.overlay,.closeall,.meetingform').removeClass('active');
		$timeout(function(){
			$('body').showNoti('Ihre Anzeige wurde abgespeichert!')
		},400)
	}

	$scope.showForm = function(){
		$('.overlay,.closeall,.meetingform').addClass('active');
	}


	initpicker();
}]);