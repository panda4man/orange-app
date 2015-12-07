(function() {
    'use strict';

    angular
        .module('orange.service.socket', [])
        .service('SocketService', Service);

    Service.$inject = ["socketFactory"];

    function Service(socketFactory) {
        this.create = function(namespace) {
            var socket = io.connect('http://localhost:4200/' + namespace);

            return socketFactory({
                ioSocket: socket
            });
        }
    }
})();
