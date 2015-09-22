'use strict';
angular.module('app.chat', ['ngRoute', 'ngAnimate']).config(['$routeProvider', '$animateProvider',
    function($routeProvider, $animateProvider) {
        $routeProvider.when('/chat', {
            templateUrl: 'views/chat/chat.html',
            controller: 'ChatCtrl'
        });
    }
]).controller('ChatCtrl', ['$scope', '$timeout', '$location', '$rootScope', 'AllService', 'socket',
    function($scope, $timeout, $location, $rootScope, AllService, socket) {
        $scope.userslist = false;
        $scope.chats = []
        $scope.showAnbieter = true;
        var AllUsers = []
        var user = localStorage.getItem('user');
        $scope.user = localStorage.getItem('user');
        $scope.chattext = ""
        $scope.bigChat = []


        AllService.getAllUsers().success(searchTerms)

            //AllService.getMyChats().success(buildChats)
        function searchTerms(data, status, headers, config) {
            $scope.anbieter = data.anbieter;
            $scope.nutzer = data.nutzer;
            for (var i = 0; i < $scope.anbieter.length; i++) {
                AllUsers.push($scope.anbieter[i])
            };
            for (var i = 0; i < $scope.nutzer.length; i++) {
                AllUsers.push($scope.nutzer[i])
            };
            socket.emit('get chats', {
                email: user
            }, buildChats)
        }

        function buildChats(data, status, headers, config) {
            var chats = data
            for (var i = 0; i < chats.length; i++) {
                if (chats[i].from == user) {
                    chats[i].display = getUserData(chats[i].to)
                } else {
                    chats[i].display = getUserData(chats[i].from)
                }
                for (var k = 0; k < chats[i].messages.length; k++) {
                    chats[i].messages[k].from = getUserData(chats[i].messages[k].from)
                };
            };
            $scope.chats = chats
        }

        function getUserData(email) {
            var userdata;
            for (var i = 0; i < AllUsers.length; i++) {
                if (AllUsers[i].email == email) {
                    userdata = AllUsers[i]
                }
            };
            return userdata
        }
        $scope.showList = function() {
            $('.userslist').animate({
                scrollTop: 0
            }, 10)
            $scope.userslist = true;
        }
        $scope.hideList = function() {
            $timeout(function() {
                $scope.userslist = false;
                $scope.searchText = "";
            }, 200)
        }
        $scope.keypress = function(e) {
            if (e.which === 40 && $(".userslist li.active").next().is('li')) {
                $(".userslist li.active").removeClass('active').next('li').addClass('active')
            } else if (e.which === 38 && $(".userslist li.active").prev().is('li')) {
                $(".userslist li.active").removeClass('active').prev('li').addClass('active')
            } else if (e.which === 13) {
                $scope.openChatWith($(".userslist li.active").attr('id'))
            }
        }
        
        $scope.openChatWith = function(id) {}

        $scope.toggleChatView = function() {
            $scope.showAnbieter = !$scope.showAnbieter
        }

        $scope.sendMessage = function(e, id) {
            if (e.which === 13) {
                socket.emit('new message',{
                    id : id,
                    from : user,
                    message : $scope.chattext
                })
            }
        }

        $scope.openChat = function(id) {
            for (var i = 0; i < $scope.chats.length; i++) {
                if ($scope.chats[i].id == id) {
                    $scope.bigChat = $scope.chats[i]
                }
            };
        }


        socket.on('new message',function(data){
            var newmessage = data
            newmessage.message.from = getUserData(newmessage.message.from)

            for (var i = 0; i < $scope.chats.length; i++) {
                if($scope.chats[i].id == newmessage.id){
                        $scope.chats[i].messages.push(newmessage.message)
                    if($scope.bigChat.id == newmessage.id){
                        $scope.openChat(newmessage.id)
                    }else{
                        // show new message arrived! in sidebar
                    }
                }
            };
            
        })

    }
]);