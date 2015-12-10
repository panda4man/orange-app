(function() {
    'use strict';

    angular
        .module('orange.controller.hangman.base', [])
        .controller('HangmanCtrl', Controller);

    Controller.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'SocketFactory']

    function Controller($scope, $rootScope, $state, $timeout, socket) {
        var vm = this;
        init();

        function init() {
            console.log('Loading the base hangman controller');
            $scope.socket = socket.hangman();

            //Listen to the server connect event
            $scope.socket.on('connect', function () {
                $scope.socket.emit('authenticate', {token: localStorage.getItem('satellizer_token')});
            });

            //Socket was not authorized so we need to relog
            $scope.socket.on('unauthorized', function () {
                $rootScope.$broadcast('event:auth-loginRequired');
            });

            $scope.socket.on('game:error', function(error) {
                console.log(error);
            });

            $scope.socket.on("error", function(error) {
                if (error.type == "UnauthorizedError" || error.code == "invalid_token") {
                    // redirect user to login page perhaps?
                    console.log("User's token has expired");
                } else {
                    console.log(error);
                }
            });
        }
    }
})();
