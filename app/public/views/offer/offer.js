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


    $scope.isAbout = true;
    $scope.isSection = false;
    $scope.isCard = false;
    $scope.isFeedback = false;
    $scope.isCheckout = false;

    function hideAll(){
        $scope.isAbout = false;
        $scope.isSection = false;
        $scope.isCard = false;
        $scope.isFeedback = false;
        $scope.isCheckout = false;
    }


    $scope.changeView = function(w){
        hideAll();

        if(w == "about"){
            $scope.isAbout = true;
        }else if(w == "card"){
            $scope.isCard = true;
        }else if(w == "feed"){
            $scope.isFeedback = true;
        }else if(w == "check"){
            $scope.isCheckout = true;
        }
    }

    $(document).on('click', '.offer-list li', function(event) {
        $('.offer-list li').removeClass('active');
        $(this).addClass('active');
    });

    $scope.showSection = function(id){
        hideAll();
        $scope.isSection = true;
        $('.section_item,.section_headings li').removeClass('active');
        $('.section_item#' + id + ',.section_headings li[data-item="' + id + '"]').addClass('active');
    }

    var m;
    $scope.callback = function(map) {
        var automessage;
        m = map;
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