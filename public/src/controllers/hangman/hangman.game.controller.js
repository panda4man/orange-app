(function() {
    'use strict';
    angular
        .module('orange.controller.hangman.game', [])
        .controller('HangmanGameCtrl', Controller);

    Controller.$inject = ['$scope'];

    function Controller($scope) {
    	var vm = this;

    	init();

    	function init(){
    		vm.data = {};
    	}
    }
})();
