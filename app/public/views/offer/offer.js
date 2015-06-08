'use strict';

angular.module('app.offer', ['ngRoute','ngAnimate'])

.config(['$routeProvider','$animateProvider', function($routeProvider,$animateProvider) {
  $routeProvider.when('/offer/:id', {
    templateUrl: 'views/offer/offer.html',
    controller: 'OfferCtrl'
  });
}])

.controller('OfferCtrl', ['$scope','$routeParams','$location','$timeout','ProviderService','AllService','$rootScope','PhotoService','MessageService',function($scope,$routeParams,$location,$timeout,ProviderService,AllService,$rootScope,PhotoService,MessageService) {
	ProviderService.offer($routeParams.id).success(buildOfferView);

	function buildOfferView(data, status, headers, config){
		$scope.offer = data;

		$scope.offer.offer.companyAmount = "10%";

		if(isPercentage($scope.offer.offer.companyAmount)){
			var amount = $scope.offer.offer.price / 100 * removeCurrencyAndParseInt($scope.offer.offer.companyAmount)
			$scope.offer.offer.endPrice = $scope.offer.offer.price - amount
		}else{
			$scope.offer.offer.endPrice = $scope.offer.offer.price - removeCurrencyAndParseInt($scope.offer.offer.companyAmount)
		}

		$scope.offer.avatar = AllService.removePublicInLink($scope.offer.avatar);
		if($scope.offer.offer.video !== undefined && $scope.offer.offer.video !== ""){
			$scope.offerVideo = true
		}
	}

	function isPercentage (string){
		return string.indexOf('%');
	}

	function removeCurrencyAndParseInt(string){
		return parseInt(string.replace('%').replace('€'))
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

	$scope.sendRequest = function(){
		MessageService.danger(1)
	}

	$scope.initPhotos = function(){
		$timeout(function(){
			$('.offer_pictures img').each(function(index, el) {
				$(this).attr('data-size', $(this).get(0).naturalHeight + 'x' + $(this).get(0).naturalWidth);
				$(this).parent('a').attr('data-size', $(this).get(0).naturalWidth + 'x' + $(this).get(0).naturalHeight);
			}).promise().done(function(){
				PhotoService.init('.offer_pictures');

				$('.Collage').removeWhitespace().collagePlus(
				    {
				        'fadeSpeed'     : 2000,
				        'targetHeight'  : 200,
				        'effect'        : 'effect-2',
				        'direction'     : 'vertical',
				        'allowPartialLastRow':true
				    }
				);
			});
		},1000)
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