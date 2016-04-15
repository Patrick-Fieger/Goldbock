'use strict';
angular.module('app.offer', ['ngRoute']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/offer/:id', {
        templateUrl: 'views/offer/offer.html',
        controller: 'OfferCtrl'
    });
}]).controller('OfferCtrl', ['$scope', '$routeParams', '$location', '$timeout', 'ProviderService', 'AllService', '$rootScope', 'PhotoService', 'MessageService', 'UserService', '$interval','AuthService','AdminService', function($scope, $routeParams, $location, $timeout, ProviderService, AllService, $rootScope, PhotoService, MessageService, UserService, $interval,AuthService,AdminService) {

    $scope.notproved = false;
    $scope.notallowed = false;
    $scope.dateSeted = false;
    var closeddays = [];

    AllService.getOffer($routeParams.id).success(buildOfferView);
    AuthService.isAdmin().success(loadAdminView);

     $scope.comments = {
            text : "",
            rating : 3
    }

    function makeid(howlong){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < howlong; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
    }

    $scope.click3 = function (param) {
        console.log('Click');
    };

    $scope.mouseHover3 = function (param) {
        console.log('mouseHover(' + param + ')');
        $scope.hoverRating3 = param;
    };

    $scope.mouseLeave3 = function (param) {
        console.log('mouseLeave(' + param + ')');
        $scope.hoverRating3 = param + '*';
    };



    function buildOfferView(data, status, headers, config) {
        $scope.date = {
            day : "",
            hour : ""
        };
        $scope.user = data.creator;
        $scope.offer = data.offer;
        $scope.offer.companyAmount = 10;
        $scope.user.avatar = AllService.removePublicInLink($scope.user.avatar.small);

        console.log($scope.offer)

        if(!$scope.offer.comments){
            $scope.offer.comments = [];
        }

        if($scope.offer.sections){
            for (var i = 0; i < $scope.offer.sections.length; i++) {
                $scope.offer.sections[i].id = makeid(10)
            }
        }

        if(data.isown && !data.offer.activated){
            $scope.notproved = true;
        }else if(data.isown && !data.offer.activated){
            $scope.notallowed = true;
        }

        for (var i = 0; i < $scope.offer.times.length; i++) {
            if(!$scope.offer.times[i].open){
                var close = i + 1;

                closeddays.push(close);
            }
        }

        initPicker();
    }


    $scope.addCommentPost = function(){
        $scope.comments.date = new Date();

        ProviderService.addComment({
            data : $scope.comments,
            id : $scope.offer.id
        }).success(addCommentToPost)
    }

    function addCommentToPost(data, status, headers, config){
        $scope.offer.comments.push(data);
    }


    var $input
    var picker

    function initPicker(){
        $('.datepicker').pickadate({
            today: '',
            clear: '',
            close: '',
            disable: closeddays,
            min: true,
            onSet: function(context) {
                setTimePicker(this.component.item.select.day)
            }
        });

        $input = $('.timepicker').pickatime({
            format: 'HH:i U!hr',
            clear: '',
            hiddenName: true
        });
        picker = $input.pickatime('picker');
    }

    function setTimePicker(day){
        var min_split = $scope.offer.times[day-1].from.split(':');
        var min = [parseInt(min_split[0]),parseInt(min_split[1])]

        var max_split = $scope.offer.times[day-1].to.split(':');
        var max = [parseInt(max_split[0]),parseInt(max_split[1])]

        picker.set({
            min: min,
            max : max
        });
    }


    function loadAdminView(data, status, headers, config){
        if(data.admin) initAdminFunctions();
    }

    function initAdminFunctions(){
        $scope.adminPanel = true;
        $scope.changeOffer = function(bool){
            var data = {
                state : bool,
                id : $routeParams.id
            }
            AdminService.changeOffer(data).success(showMessage);
        }
    }

    function showMessage(data, status, headers, config){
        alert(data);
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

    $scope.showSection = function(id){
        $('.section_item,.section_headings li').removeClass('active');
        $('.section_item#' + id + ',.section_headings li[data-item="' + id + '"]').addClass('active');
    }


    $scope.callback = function(map) {
        var automessage;
        $timeout(function(){
            map.setView([$scope.user.geo.lat, $scope.user.geo.lng], 15);
            map.touchZoom.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
            if (map.tap) map.tap.disable();
            var marker = L.marker(new L.LatLng($scope.user.geo.lat, $scope.user.geo.lng), {
                icon: L.mapbox.marker.icon({
                    'marker-color': 'cf9e34',
                    'marker-size': 'large'
                }),
                draggable: false
            });
            marker.bindPopup($scope.user.street + ', ' + $scope.user.zip + ' ' + $scope.user.city);
            marker.addTo(map);
            marker.openPopup();
        },1000)
    };

    $scope.sendRequest = function() {
        alert('Buchungen sind zu diesem Zwitpunkt leider noch nicht möglich!');
    }

}]);
//     ProviderService.offer($routeParams.id).success(buildOfferView);
//     $scope.innerover = false;
//     var descriptionMax = 124;

//     function shuffle(o) {
//         for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
//         return o;
//     }

//     function buildOfferView(data, status, headers, config) {
//         $scope.offer = data;
//         $scope.offer.offer.companyAmount = "10%";
//         if (isPercentage($scope.offer.offer.companyAmount)) {
//             var amount = $scope.offer.offer.price / 100 * removeCurrencyAndParseInt($scope.offer.offer.companyAmount)
//             $scope.offer.offer.endPrice = $scope.offer.offer.price - amount
//         } else {
//             $scope.offer.offer.endPrice = $scope.offer.offer.price - removeCurrencyAndParseInt($scope.offer.offer.companyAmount)
//         }
//         if ($scope.offer.sameCategory.lenght !== 0) {
//         	$scope.offer.sameCategory = shuffle($scope.offer.sameCategory);
//             for (var i = 0; i < $scope.offer.sameCategory.length; i++) {
//                 if ($scope.offer.sameCategory[i].description.length > descriptionMax) {
//                     $scope.offer.sameCategory[i].description = $scope.offer.sameCategory[i].description.substring(0, descriptionMax) + '...';
//                 } else {
//                     $scope.offer.sameCategory[i].description = $scope.offer.sameCategory[i].description + '...';
//                 }
//             };
//             buildSameView();
//         }
//         if ($scope.offer.avatar !== undefined) {
//             $scope.offer.avatar = AllService.removePublicInLink($scope.offer.avatar);
//         }
//         if ($scope.offer.offer.video !== undefined && $scope.offer.offer.video !== "") {
//             $scope.offerVideo = true
//         }
//     }

//     function isPercentage(string) {
//         return string.indexOf('%');
//     }

//     function removeCurrencyAndParseInt(string) {
//         return parseInt(string.replace('%').replace('€'))
//     }
//     $(window).bind('scroll', calcScroll);

//     function calcScroll(event) {
//         var top = $(window).scrollTop();
//         var max = 500
//         var perc = top / max;
//         var indexcalc = '+' + (top / ($(window).height() + 10)) * 200 + 'px'
//         if (top <= max) {
//             var op = 1 - perc
//             $('.normal_image').css('opacity', op);
//             $('.black_image,.normal_image').css('transform', 'translate3d(0,' + indexcalc + ', 0)');
//         }
//     }

//     function buildSameView() {
//         $interval(function() {
//             if ($('.user_advertising li.active').next('li').length) {
//                 $('.user_advertising li.active').removeClass('active').next('li').addClass('active');
//             } else {
//                 $('.user_advertising li.active').removeClass('active');
//                 $('.user_advertising').find('li').eq(0).addClass('active');
//             }
//         }, 5000)
//     }
//     $scope.sendRequest = function() {
//         // MessageService.danger(1)
//         $scope.innerover = true
//         $scope.spinner = true
//         $timeout(function() {
//             $scope.spinner = false;
//             $scope.check = true;
//             $timeout(function() {
//                 $scope.booking = false;
//                 $timeout(function() {
//                     $scope.innerover = false;
//                     $scope.spinner = false;
//                     $scope.check = false;
//                 }, 1000)
//             }, 3000)
//         }, 3000)
//     }
//     $scope.initPhotos = function() {
//         $timeout(function() {
//             $('.offer_pictures img').each(function(index, el) {
//                 $(this).attr('data-size', $(this).get(0).naturalHeight + 'x' + $(this).get(0).naturalWidth);
//                 $(this).parent('a').attr('data-size', $(this).get(0).naturalWidth + 'x' + $(this).get(0).naturalHeight);
//             }).promise().done(function() {
//                 PhotoService.init('.offer_pictures');
//             });
//         }, 1000)
//     }

//     function initpicker() {
//         $('.timepicker').pickatime({
//             format: 'H:i',
//             clear: '',
//             hiddenName: true,
//             min: [8, 0],
//             max: [18, 0]
//         });
//
//     }
//     // initpicker();

//     $scope.addRemoveFromFavorites = function() {
//         var fav = {
//             id: $scope.offer.offer.id
//         }
//         if ($scope.offer.isfavoriteOfUser) {
//             $scope.offer.offer.likes--;
//             fav.addOrRemove = true;
//         } else {
//             $scope.offer.offer.likes++;
//             fav.addOrRemove = false;
//         }
//         $scope.offer.isfavoriteOfUser = !$scope.offer.isfavoriteOfUser;
//         ProviderService.favorites(fav);
//     }
//     $scope.showBooking = function() {
//         $scope.booking = true
//     }
//     $scope.hideBooking = function() {
//         if (!$scope.innerover) $scope.booking = false;
//     }
// }]);