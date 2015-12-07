(function() {
    'use strict';

    angular
        .module('orange.controller.hangman', [])
        .controller('HangmanCtrl', Controller);

    Controller.$inject = ['$scope', 'SocketFactory']

    function Controller($scope, socket) {
        var vm = this;

        init();

        function init() {
            console.log('Loading the chat controller');
            vm.data = {
                socket: socket.hangman()
            };

            vm.data.socket.on('game:error', function (error){
                console.log(error);
            });

            vm.data.socket.on('game:created', function (game){
                console.log(game);
            });

            setTimeout(function () {
                vm.data.socket.emit('create', {player_limit: 3, room: 'test1', status: 'created', owner: $scope.session.current_user.id});
            }, 3000);
        }

        vm.joinTest = function () {
            vm.data.socket.emit('join');
        };

        var typingTimer;
        var typing = false;
        var doneTypingInterval = 1000;
        var $input = $('#m');

        $(document).ready(function() {
            $(document).keypress(function(e) {
                if (e.which == 13) {
                    doneTyping();
                }
            });
            $('form').submit(function() {
                vm.data.socket.emit('game:message', $('#m').val());
                $('#m').val('');
                return false;
            });

            vm.data.socket.on('game:message', function(msg) {
                $('#messages').append($('<li>').text(msg));
            });

            vm.data.socket.on('game:typing', function() {
                $('#typing').text('A user is typing');
            });

            vm.data.socket.on('game:typing-stopped', function() {
                $('#typing').text('');
            });

            //on keyup, start the countdown
            $('#m').keyup(function() {
                clearTimeout(typingTimer);
                vm.data.socket.emit('game:typing');
                typingTimer = setTimeout(doneTyping, doneTypingInterval);
            });

            //on keydown, clear the countdown 
            $('#m').keydown(function() {
                vm.data.socket.emit('game:typing');
                clearTimeout(typingTimer);
            });

            //user is "finished typing," do something
            function doneTyping() {
                vm.data.socket.emit('game:typing-stopped');
            }
        });
    }
})();
