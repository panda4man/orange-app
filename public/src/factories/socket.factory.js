(function() {
    'use strict';
    angular
        .module('orange.factory.socket', [])
        .factory('SocketFactory', Factory);

    Factory.$inject = ['socketFactory'];

    function Factory(socketFactory) {
        var myIoSocket = io.connect('http://localhost:4200');

        var _mySocket = socketFactory({
            ioSocket: myIoSocket
        });
        
        
        _mySocket.forward('broadcast');
        _mySocket.forward('welcome');
        _mySocket.forward('error');
        return _mySocket;
    }
})();
