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

            HangmanFactory.all().then(function(games) {
                vm.data.games = games;
            }, function() {

            });
        }
    }
})();
