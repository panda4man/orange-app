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

            $scope.socket.emit('join', $scope.session.current_user, $stateParams.room);
    	}

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
