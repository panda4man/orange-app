(function() {
    'use strict';
    angular
        .module('orange.factory.socket', [])
        .factory('SocketFactory', Factory);

    Factory.$inject = ['SocketService'];

    function Factory(SocketService) {
        var factory = {
            hangman: hangman,
            blackjack: blackjack
        };

        return factory;

        function hangman() {
            return SocketService.create('hangman');
        }

        function blackjack () {
            return SocketService.create('blackjack');
        }
    }
})();
