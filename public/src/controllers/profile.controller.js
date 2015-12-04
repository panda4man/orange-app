(function() {
    'use strict';
    angular
        .module('orange.controller.profile', [])
        .controller('ProfileCtrl', Controller);

    Controller.$inject = ['$scope'];

    function Controller($scope) {
    	var vm = this;

    	init();

    	function init () {
            console.log('loaded the profile controller');
    		vm.data = {

    		};
    	}
    }
})();
