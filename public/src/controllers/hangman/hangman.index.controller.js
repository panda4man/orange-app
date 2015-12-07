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

            getGames();
        }

        function getGames() {
            console.log('Retrieving updated game list.');
            HangmanFactory.all().then(function(games) {
                vm.data.games = games;
            }, function() {

            });
        }

        //When a user leaves we need to reload the
        $scope.socket.on('game:leave', function(player) {
            getGames();
        });

        $scope.socket.on('game:ended', function () {
            console.log('Game just closed');
            getGames();
        });
    }
})();
