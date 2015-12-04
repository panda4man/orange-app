(function() {
    'use strict';
    angular
        .module('orange.controller.register', [])
        .controller('RegisterCtrl', Controller);

    Controller.$inject = ['$scope'];

    function Controller($scope) {
        var vm = this;

        init();

        function init() {
            vm.data = {};
        }
    }
})();
