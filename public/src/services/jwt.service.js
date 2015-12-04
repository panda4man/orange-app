;
(function() {
    'use strict';

    angular
        .module('orange.service.jwt', [])
        .service('JWTService', Service);

    Service.$inject = ['$window'];

    function Service($window) {
        var self = this;

        self.parseJwt = function(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        }

        self.saveJwt = function (token) {
        	$window.localStorage['_satellizer_token'] = token;
        }

        self.getJwt = function () {
        	return $window.localStorage['satellizer_token'];
        }
    }
})();
