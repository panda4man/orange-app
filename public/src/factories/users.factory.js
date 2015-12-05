(function() {
    'use strict';

    angular
        .module('orange.factory.users', [])
        .factory('UsersFactory', Factory);

    Factory.$inject = ['$http', '$q', 'Config'];

    function Factory($http, $q, Config) {
    	var factory = {
    		update: update
    	};

    	return factory;

    	function update (data) {
            var deferred = $q.defer();
            $http({
                method: 'PUT',
                url: Config.baseUrl + 'api/users/' + data.id,
                data: data
            }).success(function (res){
            	console.log(res);
            	deferred.resolve();
            }).error(function (err){
            	console.log(err);
            	deferred.reject();
            });
            return deferred.promise;
        }
    }
})();
