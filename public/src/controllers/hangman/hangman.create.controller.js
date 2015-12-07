(function() {
    'use strict';

    angular
        .module('orange.controller.hangman.create', [])
        .controller('HangmanCreateCtrl', Controller);

    Controller.$inject = ['$scope', '$state', '$timeout']

    function Controller($scope, $state, $timeout) {
        var vm = this;

        init();

        function init() {
            vm.data = {
                forms: {
                    create: {
                        status: 'created',
                        players: []
                    }
                }
            };

            $timeout(function() {
                vm.data.forms.create.owner = $scope.session.current_user.id;
            }, 500);
        }

        $scope.socket.on('game:created', function(game) {
            console.log(game);
            $state.go('app.master.hangman.lobby', {
                room: game.room
            });
        });

        vm.create = function() {
            $scope.socket.emit('create', vm.data.forms.create);
        };
    }
})();
