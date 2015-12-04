;(function () {
	'use strict';

	angular
	.module('orange.service.sessions', [])
	.service('SessionsService', Service);

	Service.$inject = ['$window'];

	function Service ($window) {
		var self = this;

		self.create = function (data, user) {
			$window.localStorage['current_user'] = user;
			console.log(data);
			data.session.current_user = user;
			data.session.logged_in = true;
		}

		self.destroy = function (data) {
			$window.localStorage.removeItem('_satellizer_token');
			$window.localStorage.removeItem('satellizer_token');
			$window.localStorage.removeItem('current_user');
			data.session.current_user = {};
			data.session.logged_in = false;
		}
	}
})();