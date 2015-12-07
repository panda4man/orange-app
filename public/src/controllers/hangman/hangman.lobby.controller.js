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

    		};

            $scope.socket.emit('join', $scope.session.current_user, $stateParams.room);
    	}

        $scope.$on('$destroy', function () {
            console.log('%s is leaving the lobby', $scope.session.current_user.id);
            $scope.socket.emit('leave', $scope.session.current_user, $stateParams.room);
        });
    }
})();
