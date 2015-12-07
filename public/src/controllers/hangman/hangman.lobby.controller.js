(function() {
    'use strict';

    angular
        .module('orange.controller.hangman.lobby', [])
        .controller('HangmanLobbyCtrl', Controller);

    Controller.$inject = ['$scope', '$stateParams'];

    function Controller($scope, $stateParams) {
    	var vm = this;

    	init();

    	function init () {
            console.log('Loading the hangman lobby controller');
    		vm.data = {
                game: null
            };

            //On page load send a join event to server with current user and game room
            //I think we should change this to an event we emit on button click
            //on the hangman.index view...
            $scope.socket.emit('join', $scope.session.current_user, $stateParams.room);
    	}

        vm.ready = function () {
            //TO DO
            //Handle user clicking the ready button to signal they are good to go
        };

        vm.notReady = function () {
            //TO DO
            //Handle user clicking the not ready button to signal they need more time
        };

        //Listeners
        $scope.socket.on('game:joined', function (data){
            console.log('%s just joined the game!', data.player.full_name);
            vm.data.game = data.game;
        });

        $scope.socket.on('game:leave', function (data){
            console.log('%s just left the game!', data.player.full_name);
            vm.data.game = data.game;
        });

        //If player leaves the lobby remove them from game.
        $scope.$on('$destroy', function () {
            console.log('%s is leaving the lobby', $scope.session.current_user.id);
            $scope.socket.emit('leave', $scope.session.current_user, $stateParams.room);
        });
    }
})();
