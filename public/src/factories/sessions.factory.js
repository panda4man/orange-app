(function() {
    'use strict';
    angular
        .module('orange.factory.sessions', [])
        .factory('SessionsFactory', Factory);

    Factory.$inject = ['$http', '$timeout', '$rootScope', '$q', '$auth', 'Config'];

    function Factory($http, $timeout, $rootScope, $q, $auth, Config) {
        var _session = {};
        var factory = {
            login: login,
            logout: logout,
            profile: profile,
            session: _session
        };

        return factory;

        function login(data) {
            var deferred = $q.defer();
            var config = {
                ignoreAuthModule: true
            };
            $auth.login(data, config).then(function(res) {
                localStorage.setItem('current_user', JSON.stringify(res.data.user));
                _session.current_user = res.data.user;
                _session.logged_in = true;
                deferred.resolve();
            }).catch(function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function logout () {
            $auth.logout();
            _session.logged_in = false;
            _session.current_user = {};
            localStorage.setItem('current_user', null);
        }

        function profile() {
            var current_user = localStorage.getItem('current_user');

            var deferred = $q.defer();

            if (current_user === 'null' || current_user === null || current_user === undefined || current_user === 'undefined') {
                $timeout(function () {
                    $rootScope.$broadcast('event:auth-loginRequired');
                }, 1);
                deferred.reject();
            } else {
                current_user = JSON.parse(current_user);
                $http.get(Config.baseUrl + 'api/users/' + current_user.id).success(function(res) {
                    localStorage.setItem('current_user', JSON.stringify(res.data));
                    _session.current_user = res.data;
                    _session.logged_in = true;
                    deferred.resolve();
                }).error(function(err) {
                    deferred.reject(err);
                });
            }

            return deferred.promise;
        }
    }
})();
