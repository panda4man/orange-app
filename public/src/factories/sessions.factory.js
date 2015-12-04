(function() {
    'use strict';
    angular
        .module('orange.factory.sessions', [])
        .factory('SessionsFactory', Factory);

    Factory.$inject = ['$http', '$q', '$auth', 'Config'];

    function Factory($http, $q, $auth, Config) {
    	var factory = {
    		login: login
    	};

        return factory;

    	function login (data) {
            var deferred = $q.defer();
            var config = {
                ignoreAuthModule: true
            };
            $auth.login(data, config).then(function (res){
                deferred.resolve(res);
            }).catch(function (err){
                deferred.reject(err);
            });
            return deferred.promise;
    	}
    }
})();
