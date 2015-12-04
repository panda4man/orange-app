(function() {
    'use strict';

    angular
        .module('orange.run', [])
        .run(Run);

    Run.$inject = ['$rootScope', '$state'];

    function Run($rootScope, $state) {
    	$(document).ready(function () {
    		$(".dropdown-button").dropdown();
    	});

        $rootScope.$on('$stateChangeSuccess', function() {
            $rootScope.title = $state.current.title;
        });
    }
})();
