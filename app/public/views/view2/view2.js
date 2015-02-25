'use strict';
angular.module('myApp.view2', ['ngRoute', 'ngAnimate']).config(['$routeProvider', '$animateProvider',
    function($routeProvider, $animateProvider) {
        $routeProvider.when('/kategorien', {
            templateUrl: 'views/view2/view2.html',
            controller: 'View2Ctrl'
        });
    }
]).controller('View2Ctrl', ['$scope', '$timeout','$location','$rootScope',
    function($scope, $timeout,$location,$rootScope) {
        $scope.hidelogo = false;
        $scope.listforitem = true;

        $('.datepicker').pickadate(
            {
                today: '',
                clear: '',
                close: '',
                min:true,
                onOpen: function() {
                  //console.log('Opened up')
                },
                onClose: function() {
                  //console.log('Closed now')
                }
            }
        );

        var coming = ['kaufen-spenden','Urlaub'];

        $scope.hideLogoShowList = function(e){
            $scope.hidelogo = true;
            $scope.listforitem = false;
            var kat = $(e.target).attr('kategorie');
            localStorage.setItem('kat',kat);

            $('.listforitem ul').hide();
            $('#coming').hide();
            $('#help').removeClass('active');
            $('.listforitem #'+$(e.target).attr('kategorie')).show();
            $('.roundabout .item').addClass('hide_');
            $(e.target).closest('div').removeClass('hide_');
        
            if ($.inArray(kat, coming) > -1){
              $('#coming').show();
            }

            if(kat == "hilfe"){
                $scope.hidelogo = false;
                $('#help').addClass('active');
            }

            if(kat == "wocheneinkauf"){
                $scope.hidelogo = false;
                $('#einkauf').addClass('active');
            }

            if(kat == "tauschen"){
                localStorage.setItem('kat','tauschen');
                $location.path("/angebote/tauschen");
            }
        }

        function showNotification() {
            // var audio = new Audio();
            // audio.src="sounds/sound.mp3"
            // audio.play();
            $('.opennoti').addClass('shownoti');

            setTimeout(function(){
                $('.opennoti').addClass('pulse');                
            },2000);
        }



        $scope.submitMeeting = function(){
            $('.overlay,.closeall,.meetingform').removeClass('active');
            $timeout(function(){
                $('body').showNoti('Die Buchungsanfrage wurde erfolgreich versendet!')
            },500);
        }


        $scope.positioning = function() {
            var elems = $('.item')
            var increase = Math.PI * 2 / elems.size();
            var x = 0,
                y = 0,
                angle = 0,
                size = 250
                elems.each(function(index, el) {
                    x = size * Math.cos(angle) + 100;
                    y = size * Math.sin(angle) + 100;
                    $(this).css({
                        left: x + 'px',
                        top: y + 'px',
                    });
                    angle += increase;
                }).promise().done(function() {
                    elems.each(function(index, el) {
                        $timeout(function() {
                            $(el).addClass('active');
                        }, 100 * index);
                    }).promise().done(function() {
                        $timeout(function() {
                            showNotification();
                        }, 3000)
                    })
                });
        }
    }
]);