'use strict';
angular.module('app.offer', ['ngRoute']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/offer/:id', {
        templateUrl: 'views/offer/offer.html',
        controller: 'OfferCtrl'
    });
}]).controller('OfferCtrl', ['$scope', '$routeParams', '$location', '$timeout', 'ProviderService', 'AllService', '$rootScope', 'PhotoService', 'MessageService', 'UserService', '$interval', function($scope, $routeParams, $location, $timeout, ProviderService, AllService, $rootScope, PhotoService, MessageService, UserService, $interval) {
    ProviderService.offer($routeParams.id).success(buildOfferView);
    $scope.innerover = false;
    var descriptionMax = 124;

    function shuffle(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    function buildOfferView(data, status, headers, config) {
        $scope.offer = data;
        $scope.offer.offer.companyAmount = "10%";
        if (isPercentage($scope.offer.offer.companyAmount)) {
            var amount = $scope.offer.offer.price / 100 * removeCurrencyAndParseInt($scope.offer.offer.companyAmount)
            $scope.offer.offer.endPrice = $scope.offer.offer.price - amount
        } else {
            $scope.offer.offer.endPrice = $scope.offer.offer.price - removeCurrencyAndParseInt($scope.offer.offer.companyAmount)
        }
        if ($scope.offer.sameCategory.lenght !== 0) {
        	$scope.offer.sameCategory = shuffle($scope.offer.sameCategory);
            for (var i = 0; i < $scope.offer.sameCategory.length; i++) {
                if ($scope.offer.sameCategory[i].description.length > descriptionMax) {
                    $scope.offer.sameCategory[i].description = $scope.offer.sameCategory[i].description.substring(0, descriptionMax) + '...';
                } else {
                    $scope.offer.sameCategory[i].description = $scope.offer.sameCategory[i].description + '...';
                }
            };
            buildSameView();
        }
        if ($scope.offer.avatar !== undefined) {
            $scope.offer.avatar = AllService.removePublicInLink($scope.offer.avatar);
        }
        if ($scope.offer.offer.video !== undefined && $scope.offer.offer.video !== "") {
            $scope.offerVideo = true
        }
    }

    function isPercentage(string) {
        return string.indexOf('%');
    }

    function removeCurrencyAndParseInt(string) {
        return parseInt(string.replace('%').replace('€'))
    }
    $(window).bind('scroll', calcScroll);

    function calcScroll(event) {
        var top = $(window).scrollTop();
        var max = 500
        var perc = top / max;
        var indexcalc = '+' + (top / ($(window).height() + 10)) * 200 + 'px'
        if (top <= max) {
            var op = 1 - perc
            $('.normal_image').css('opacity', op);
            $('.black_image,.normal_image').css('transform', 'translate3d(0,' + indexcalc + ', 0)');
        }
    }

    function buildSameView() {
        $interval(function() {
            if ($('.user_advertising li.active').next('li').length) {
                $('.user_advertising li.active').removeClass('active').next('li').addClass('active');
            } else {
                $('.user_advertising li.active').removeClass('active');
                $('.user_advertising').find('li').eq(0).addClass('active');
            }
        }, 5000)
    }
    $scope.sendRequest = function() {
        // MessageService.danger(1)
        $scope.innerover = true
        $scope.spinner = true
        $timeout(function() {
            $scope.spinner = false;
            $scope.check = true;
            $timeout(function() {
                $scope.booking = false;
                $timeout(function() {
                    $scope.innerover = false;
                    $scope.spinner = false;
                    $scope.check = false;
                }, 1000)
            }, 3000)
        }, 3000)
    }
    $scope.initPhotos = function() {
        $timeout(function() {
            $('.offer_pictures img').each(function(index, el) {
                $(this).attr('data-size', $(this).get(0).naturalHeight + 'x' + $(this).get(0).naturalWidth);
                $(this).parent('a').attr('data-size', $(this).get(0).naturalWidth + 'x' + $(this).get(0).naturalHeight);
            }).promise().done(function() {
                PhotoService.init('.offer_pictures');
            });
        }, 1000)
    }

    function initpicker() {
        $('.timepicker').pickatime({
            format: 'H:i',
            clear: '',
            hiddenName: true,
            min: [8, 0],
            max: [18, 0]
        });
        $('.datepicker').pickadate({
            format: 'dd.mm.yyyy',
            today: '',
            clear: '',
            close: '',
            hiddenName: true,
            disable: [
                6, 7
            ],
            min: true,
            onSet: function(context) {
                console.log(this)
            }
        });
    }
    // initpicker();
    $scope.callback = function(map) {
        var automessage;

        function turnON() {
            automessage = setInterval(function() {
                if ($scope.offer !== undefined) {
                    map.setView([$scope.offer.geo.lat, $scope.offer.geo.lng], 15);
                    map.touchZoom.disable();
                    map.doubleClickZoom.disable();
                    map.scrollWheelZoom.disable();
                    if (map.tap) map.tap.disable();
                    var marker = L.marker(new L.LatLng($scope.offer.geo.lat, $scope.offer.geo.lng), {
                        icon: L.mapbox.marker.icon({
                            'marker-color': 'cf9e34',
                            'marker-size': 'large'
                        }),
                        draggable: false
                    });
                    marker.bindPopup($scope.offer.street + ', ' + $scope.offer.zip + ' ' + $scope.offer.city);
                    marker.addTo(map);
                    marker.openPopup();
                    turnOff();
                }
            }, 500);
        }

        function turnOff() {
            clearInterval(automessage);
        }
        turnON();
    };
    $scope.addRemoveFromFavorites = function() {
        var fav = {
            id: $scope.offer.offer.id
        }
        if ($scope.offer.isfavoriteOfUser) {
            $scope.offer.offer.likes--;
            fav.addOrRemove = true;
        } else {
            $scope.offer.offer.likes++;
            fav.addOrRemove = false;
        }
        $scope.offer.isfavoriteOfUser = !$scope.offer.isfavoriteOfUser;
        ProviderService.favorites(fav);
    }
    $scope.showBooking = function() {
        $scope.booking = true
    }
    $scope.hideBooking = function() {
        if (!$scope.innerover) $scope.booking = false;
    }
}]);