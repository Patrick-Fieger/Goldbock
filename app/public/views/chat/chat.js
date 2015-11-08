'use strict';
angular.module('app.chat', ['ngRoute', 'ngAnimate']).config(['$routeProvider', '$animateProvider',
    function($routeProvider, $animateProvider) {
        $routeProvider.when('/chat', {
            templateUrl: 'views/chat/chat.html',
            controller: 'ChatCtrl'
        });
    }
]).controller('ChatCtrl', ['$scope', '$timeout', '$location', '$rootScope', 'AllService', 'socket','UserService',
    function($scope, $timeout, $location, $rootScope, AllService, socket,UserService) {
        $scope.userslist = false;
        $scope.bigChat_input = false;
        $scope.chats = []
        $scope.showAnbieter = true;
        var AllUsers = []
        var user = localStorage.getItem('user');
        $scope.user = localStorage.getItem('user');
        $scope.chattext = ""
        $scope.bigChat = [];
        $scope.displayAds = false;

        socket.emit('join',{email : user});
        AllService.getAllUsers().success(searchTerms)


        function searchTerms(data, status, headers, config) {
            $scope.anbieter = data.anbieter;
            $scope.nutzer = data.nutzer;
            $scope.role = data.role;
            
            if($scope.role == "user"){
                getAdvertising();
            }


            for (var i = 0; i < $scope.anbieter.length; i++) {
                AllUsers.push($scope.anbieter[i])
            };
            for (var i = 0; i < $scope.nutzer.length; i++) {
                AllUsers.push($scope.nutzer[i])
            };
            getChats();
        }

        socket.on('open old chat',function(chat){
            $scope.chats = [];
            getChats();
        });

        function getAdvertising(){
            UserService.getAds().success(buildAds);
        };

        function buildAds(data){
            $scope.displayAds = true;
            $scope.adds_ = data.ads;

        }

        $scope.toggleAds = false;

        $scope.showAdds = function(){
            $scope.toggleAds = true;
        }

        $scope.closeAds = function(){
            $scope.toggleAds = false;   
        }

        function getChats(){
            socket.emit('get chats', {
                email: user
            }, buildChats);    
        }

        function buildChats(data) {
            var chats = data

            for (var i = 0; i < chats.length; i++) {
                if (chats[i].from == user) {
                    chats[i].display = getUserData(chats[i].to);

                    if(chats[i].unreadFrom){
                        $('.chatlist #' + chats[i].id).addClass('unread')
                    }

                } else {
                    chats[i].display = getUserData(chats[i].from)
                }
                for (var k = 0; k < chats[i].messages.length; k++) {
                    chats[i].messages[k].from = getUserData(chats[i].messages[k].from)
                };

                if(chats[i].isArchieved.indexOf(user) > -1){
                    chats[i].hideChat = true
                }
            };

            $scope.chats = chats;
            checkUnreadedMessages();
        }

        function checkUnreadedMessages(){
            for (var i = 0; i < $scope.chats.length; i++) {
                if ($scope.chats[i].unreaded.indexOf(user) > -1){
                    var id = $scope.chats[i].id
                    $timeout(function(){
                        $('.chatlist #' + id).addClass('unread')
                    },0)
                    
                }
            }
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
        
        $scope.openChatWith = function(email) {
            var chatsToEmails = []
            if($scope.chats.length > 0){
                for (var i = 0; i < $scope.chats.length; i++) {
                    chatsToEmails.push($scope.chats[i].to)
                    if(i == $scope.chats.length - 1){
                        if(email.indexOf(chatsToEmails) == -1){
                            socket.emit('open new chat',{
                                from : user,
                                to : email
                            },addNewChatToList);
                        }else{
                            $timeout(function(){
                                $('.chatlist li[data-email="'+email+'"]').trigger('click');
                            });
                        }
                    }
                };
            }else{
                socket.emit('open new chat',{
                    from : user,
                    to : email
                },addNewChatToList);
            }
        }


        function addNewChatToList(data,self_){
            var newchat = data



            if (newchat.from == user) {
                newchat.display = getUserData(newchat.to)
            } else {
                newchat.display = getUserData(newchat.from)
            }

            newchat.messages = [];
            $scope.chats.push(newchat);

            $timeout(function(){

                if(self_){
                    $('.chatlist li#' + data.id).addClass('unread')
                }else{
                    $('.chatlist li#' + data.id).addClass('active') 
                }

                
            });
        }


        socket.on('new chat opened',function(data){
            addNewChatToList(data,true);
            socket.emit('sign to new chat',{id : data.id})
        });


        $scope.toggleChatView = function() {
            $scope.showAnbieter = !$scope.showAnbieter
        }


        $scope.typing = false;
        $scope.whosTyping = "";
        var timeout = undefined;

        $scope.sendMessage = function(e, id) {
            if (e.which === 13 && $scope.chattext !== "") {
                e.preventDefault();
                socket.emit('new message',{
                    id : id,
                    from : user,
                    message : $scope.chattext
                })
                $scope.chattext = "";
            }else{
                clearTimeout(timeout)
                timeout = setTimeout(function(){
                    noMoreTyping(id)
                }, 2000);
                

                socket.emit('typing',{
                    id : id,
                    user : user,
                    typing : true
                });
                
            }
        }


        function noMoreTyping(id){
            socket.emit('typing',{
                id : id,
                user : user,
                typing : false
            });
        }


        socket.on('typing',function(data){
            var me = checkSelf(data.user)
            

            if(!me && data.typing){
                $scope.typing = true;
                $scope.whosTyping = getUserData(data.user)
            }else{
                $scope.typing = false;
            }

        });

        function checkSelf(typingUser){
            var me = false;

            if(user === typingUser){
                me = true
            }

            return me
        }

        $scope.openChat = function(id) {
            for (var i = 0; i < $scope.chats.length; i++) {
                if ($scope.chats[i].id == id) {
                    $scope.bigChat_input = true;
                    $('.chatlist li').removeClass('active');
                    $('.chatlist li#' + id).addClass('active')
                    $scope.bigChat = $scope.chats[i];
                    markAsReaded(id);
                }
            };
        }


        $scope.archiveChat = function(id){
            if(confirm('Wollen sie diesen Chat wirklich löschen?')){
                socket.emit('delete chat',{
                    id : id,
                    email : user
                },deleteChat)    
            }
        }

        function deleteChat(data){
            if(data.isDeleted){
                for (var i = 0; i < $scope.chats.length; i++) {
                    if($scope.chats[i].id == data.id){
                        if($scope.bigChat.id == data.id){
                            $scope.bigChat = [];
                        }

                        $scope.chats.splice(i,1);
                        $scope.bigChat_input = false;
                    }
                };
            }
        }

        function markAsReaded(id){
            socket.emit('message readed',{
                from : user,
                id : id   
            });

            $('.chatlist #' + id).removeClass('unread');
        }


        var ping = new Audio("../../sound/sound.mp3");

        socket.on('new message',function(data){
            var newmessage = data
            newmessage.message.from = getUserData(newmessage.message.from)

            //ping.play();

            for (var i = 0; i < $scope.chats.length; i++) {

                if($scope.chats[i].id == newmessage.id){
                    $scope.chats[i].messages.push(newmessage.message)
                    
                    if($scope.bigChat.id == newmessage.id){
                        $scope.openChat(newmessage.id);
                        markAsReaded(newmessage.id)
                    }else{
                        $('.chatlist #' + newmessage.id).addClass('unread')
                    }
                }
            };

        })

    }
]);