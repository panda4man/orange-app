(function() {
    'use strict';

    angular
        .module('orange.controller.hangman.index', [])
        .controller('HangmanIndexCtrl', Controller);

    Controller.$inject = ['$scope', 'HangmanFactory']

    function Controller($scope, HangmanFactory) {
        var vm = this;

        init();

        function init() {
            vm.data = {
                games: []
            };

            $scope.socket.emit('games:request');
        }

        $scope.$on('games:updated', function() {
            console.log('games were updated');
            vm.data.games = $scope.games;
        });

        //When a user leaves we need to reload the
        $scope.socket.on('game:leave', function(player) {
            console.log('%s just left the room.', player.full_name);
        });

        $scope.socket.on('game:ended', function() {
            console.log('Game just closed');
        });
    }
})();
