(function() {
    'use strict';

    angular
        .module('orange.controller.hangman', [])
        .controller('HangmanCtrl', Controller);

    Controller.$inject = ['$scope', '$state', '$timeout', 'SocketFactory', 'HangmanFactory']

    function Controller($scope, $state, $timeout, socket, HangmanFactory) {
        var vm = this;
        init();
        function init() {
            console.log('Loading the chat controller');
            vm.data = {
                socket: socket.hangman(),
                games: [],
                forms: {
                    create: {
                        status: 'created'
                    }
                }
            };

            $timeout(function () {
                vm.data.forms.create.owner = $scope.session.current_user.id;
            }, 50);

            vm.data.socket.on('game:error', function (error){
                console.log(error);
            });

            vm.data.socket.on('game:created', function (game){
                console.log(game);
                $state.go('app.master.hangman-game-lobby', {room: game.room});
            });

            setTimeout(function () {
                //vm.data.socket.emit('create', {player_limit: 3, room: 'test1', status: 'created', owner: $scope.session.current_user.id});
                vm.data.socket.emit('join', $scope.session.current_user, 'test1');
            }, 3000);

            HangmanFactory.all().then(function (games){
                vm.data.games = games;
            }, function (){

            });
        }

        vm.create = function () {
            vm.data.socket.emit('create', vm.data.forms.create);
        };
    }
})();
