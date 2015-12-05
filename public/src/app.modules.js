(function () {
	'use strict';

	angular.module('orange', ['btford.socket-io', 'ngAnimate', 'satellizer', 'http-auth-interceptor', 'ui.router', 'orange.templates', 'orange.config', 'orange.factories', 'orange.services', 'orange.controllers', 'orange.run']);
})();