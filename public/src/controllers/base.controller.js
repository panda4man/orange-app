(function() {
    'use strict';
    angular
        .module('orange.controller.base', [])
        .controller('BaseCtrl', Controller);

    Controller.$inject = [];

    function Controller() {
        var vm = this;

        init();

        function init() {
            console.log('Loading base controller');
        }
    }
})();
