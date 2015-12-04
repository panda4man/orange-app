(function() {
    'use strict';
    angular
        .module('orange.controller.base', [])
        .controller('BaseCtrl', Controller);

    Controller.$inject = ['$rootScope', '$scope', 'authService', 'SessionsFactory'];

    function Controller($rootScope, $scope, authService, SessionsFactory) {
        var vm = this;

        init();

        function init() {
            $scope.session = {};
            vm.data = {
                forms: {
                    login: {
                        username: '',
                        password: ''
                    }
                }
            };
            console.log('Loading base controller');

            $(function () {
                $('#login').openModal();
            });
        }

        $rootScope.$on('event:auth-loginRequired', function(event, data) {

        });

        $scope.login = function() {
            SessionsFactory.login(vm.data.forms.login).then(function(res) {
                console.log(res);
                $scope.session.current_user = res.data.user;
                $('#login').closeModal();
            }, function(err) {
                console.log(err);
            });
        }
    }
})();
