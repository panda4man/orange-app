(function() {
    'use strict';
    angular
        .module('orange.controller.register', [])
        .controller('RegisterCtrl', Controller);

    Controller.$inject = ['$scope', '$state', 'SessionsFactory'];

    function Controller($scope, $state, SessionsFactory) {
        var vm = this;

        init();

        function init() {
            vm.data = {
                forms: {
                    register: {

                    }
                }
            };
        }

        vm.register = function() {
            SessionsFactory.register(vm.data.forms.register).then(function() {
                vm.data.forms.register = {};
                $state.go('app.master.profile');
            }, function() {

            });
        }
    }
})();
