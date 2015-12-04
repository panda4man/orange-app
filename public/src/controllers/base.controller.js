(function() {
    'use strict';
    angular
        .module('orange.controller.base', [])
        .controller('BaseCtrl', Controller);

    Controller.$inject = ['$rootScope', '$scope', '$state', 'authService', 'SessionsFactory', 'Config'];

    function Controller($rootScope, $scope, $state, authService, SessionsFactory, Config) {
        var vm = this;

        init();

        function init() {
            $scope.session = SessionsFactory.session;
            $scope.config = Config;
            vm.data = {
                forms: {
                    login: {
                        username: '',
                        password: ''
                    }
                }
            };
            console.log('Loading base controller');

            SessionsFactory.profile();
        }

        $rootScope.$on('event:auth-loginRequired', function(events, msg) {
            SessionsFactory.logout();
            showLogin();
        });

        $rootScope.$on('event:auth-loginConfirmed', function (events, msg){
            hideLoginModal();
        });

        function showLogin() {
            $(function() {
                $('#login').openModal();
            });
        }

        function hideLoginModal() {
            $(function() {
                $('#login').closeModal();
            });
        }

        $scope.register = function () {
            hideLoginModal();
            $state.go('app.simple.register');
        }

        $scope.login = function() {
            SessionsFactory.login(vm.data.forms.login).then(function(res) {
                vm.data.forms.login = {};
                authService.loginConfirmed();
                hideLoginModal();
            }, function(err) {
                console.log(err);
            });
        }

        $scope.logout = function() {
            $rootScope.$broadcast('event:auth-loginRequired');
        }
    }
})();
