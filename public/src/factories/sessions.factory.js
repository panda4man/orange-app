(function() {
    'use strict';
    angular
        .module('orange.factory.sessions', [])
        .factory('SessionsFactory', Factory);

    Factory.$inject = ['$http', '$timeout', '$rootScope', '$q', '$auth', 'Config', 'JWTService', 'SessionsService'];

    function Factory($http, $timeout, $rootScope, $q, $auth, Config, Jwt, Session) {
        var _sessionData = {
            session: {
                current_user: null,
                logged_in: false
            }
        };
        var factory = {
            login: login,
            logout: logout,
            profile: profile,
            session: _sessionData
        };

        return factory;

        function login(data) {
            var deferred = $q.defer();
            var config = {
                ignoreAuthModule: true
            };
            $auth.login(data, config).then(function(res) {
                Session.create(_sessionData, res.data.user);
                deferred.resolve();
            }).catch(function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function logout () {
            $auth.logout();
            Session.destroy(_sessionData);
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
                    Session.create(_sessionData, res.data);
                    deferred.resolve();
                }).error(function(err) {
                    deferred.reject(err);
                });
            }

            return deferred.promise;
        }
    }
})();
