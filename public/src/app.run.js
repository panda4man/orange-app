(function() {
    'use strict';

    angular
        .module('orange.run', [])
        .run(Run);

    Run.$inject = ['$rootScope', '$state', 'ErrorsFactory'];

    function Run($rootScope, $state, ErrorsFactory) {
    	$(document).ready(function () {
    		$(".dropdown-button").dropdown();
    	});

        $rootScope.$on('$stateChangeSuccess', function() {
            $rootScope.title = $state.current.title;
            ErrorsFactory.clear();
        });
    }
})();
