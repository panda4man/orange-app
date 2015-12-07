(function() {
    'use strict';

    angular
        .module('orange.factory.games.hangman', [])
        .factory('HangmanFactory', Factory);

    Factory.$inject = ['$http', '$q', 'Config'];

    function Factory($http, $q, Config) {
    	var factory = {
    		all: all
    	};

    	return factory;

    	function all () {
    		var deferred = $q.defer();
    		$http.get(Config.baseUrl + 'api/games/hangman').success(function (res){
    			deferred.resolve(res.data);
    		}).error(function (err){
    			console.log(err);
    			deferred.reject();
    		});

    		return deferred.promise;
    	}

        function show (id) {
           var deferred = $q.defer();
            $http.get(Config.baseUrl + 'api/games/hangman/' + id).success(function (res){
                deferred.resolve(res.data);
            }).error(function (err){
                deferred.reject();
            });

            return deferred.promise; 
        }
    }
})();
