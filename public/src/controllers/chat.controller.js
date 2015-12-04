(function() {
    'use strict';

    angular
        .module('orange.controller.chat', [])
        .controller('ChatCtrl', Controller);

    Controller.$inject = ['$scope', 'SocketFactory']

    function Controller($scope, socket) {
        var vm = this;

        init();

        function init() {
            console.log('Loading the chat controller');
        }

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
                socket.emit('chat:message', $('#m').val());
                $('#m').val('');
                return false;
            });

            socket.on('chat:message', function(msg) {
                $('#messages').append($('<li>').text(msg));
            });

            socket.on('chat:typing', function() {
                $('#typing').text('A user is typing');
            });

            socket.on('chat:typing-stopped', function() {
                $('#typing').text('');
            });

            //on keyup, start the countdown
            $('#m').keyup(function() {
                clearTimeout(typingTimer);
                socket.emit('chat:typing');
                typingTimer = setTimeout(doneTyping, doneTypingInterval);
            });

            //on keydown, clear the countdown 
            $('#m').keydown(function() {
                socket.emit('chat:typing');
                clearTimeout(typingTimer);
            });

            //user is "finished typing," do something
            function doneTyping() {
                socket.emit('chat:typing-stopped');
            }
        });
    }
})();
