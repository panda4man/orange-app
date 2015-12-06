;(function () {
	'use strict';

	angular
	.module('orange.service.sessions', [])
	.service('SessionsService', Service);

	Service.$inject = ['$window'];

	function Service ($window) {
		var self = this;

		self.create = function (data, user, token) {
			console.log(user);
			$window.localStorage['current_user'] = JSON.stringify(user);
			if(token && token !== "" && token !== null && token !== "null"){
				$http.defaults.headers.common.Authorization = 'Bearer ' + res.token;
				$window.localStorage['satellizer_token'] = token;
				$window.localStorage['_satellizer_token'] = token;
			}
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