(function() {
    'use strict';

    angular
        .module('orange.controller.hangman.base', [])
        .controller('HangmanCtrl', Controller);

    Controller.$inject = ['$scope', '$state', '$timeout', 'SocketFactory']

    function Controller($scope, $state, $timeout, socket) {
        var vm = this;
        init();
        function init() {
            console.log('Loading the chat controller');
            $scope.socket = socket.hangman();
            
            $scope.socket.on('game:error', function (error){
                console.log(error);
            });

            $scope.socket.on('game:joined', function (data){
                console.log('Someone joined: ' + JSON.stringify(data));
            });

            $scope.socket.on('game:left', function (data){
                console.log('Someone left ' + JSON.stringify(data));
            })
        }
    }
})();
