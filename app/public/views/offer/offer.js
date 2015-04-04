'use strict';

angular.module('app.offer', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/offer/:id', {
    templateUrl: 'views/offer/offer.html',
    controller: 'OfferCtrl'
  });
}])

.controller('OfferCtrl', ['$scope','$routeParams','$location','$timeout','ProviderService','AllService','AuthService','UploadService','$rootScope',function($scope,$routeParams,$location,$timeout,ProviderService,AllService,AuthService,UploadService,$rootScope) {
	ProviderService.offer($routeParams.id).success(buildOfferView);

	function buildOfferView(data, status, headers, config){
		$scope.offer = data;
		$scope.offer.avatar = AllService.removePublicInLink($scope.offer.avatar);
		console.log(data)
	}

	$(window).bind('scroll', calcScroll);

	function calcScroll(event){
		var top = $(window).scrollTop();
		var max = 500
		var perc = top / max;
		var indexcalc= '+'+(top/($(window).height()+10))*200 +'px'
		if(top <= max){
			var op = 1 - perc
			$('.normal_image').css('opacity',op);

			$('.black_image,.normal_image').css('transform','translate3d(0,'+  indexcalc  + ', 0)');
		}
		
	}

	function initpicker (){
		$('.timepicker').pickatime({
			format: 'H:i',
			clear: '',
			hiddenName: true,
  			min: [8,0],
  			max: [18,0]
		});

		$('.datepicker').pickadate(
            {
            	format: 'dd.mm.yyyy',
                today: '',
                clear: '',
                close: '',
                hiddenName: true,
                disable: [
        			6,7
    			],
                min:true,
                onSet: function(context) {
   				 console.log(this)
  				}
            }
        );
	}

	initpicker();

}]);