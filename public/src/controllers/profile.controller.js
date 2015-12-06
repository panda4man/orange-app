(function() {
    'use strict';
    angular
        .module('orange.controller.profile', [])
        .controller('ProfileCtrl', Controller);

    Controller.$inject = ['$scope', '$state', 'UsersFactory'];

    function Controller($scope, $state, UsersFactory) {
        var vm = this;

        init();

        function init() {
            console.log('loaded the profile controller');
            vm.data = {
                forms: {
                    edit: {}
                }
            };
        }

        vm.update = function() {
            UsersFactory.update($scope.session.current_user).then(function () {
                $state.go('app.master.profile');
            }, function () {

            });
        };
    }
})();
