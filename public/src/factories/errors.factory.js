(function() {
    'use strict';

    angular
        .module('orange.factory.errors', [])
        .factory('ErrorsFactory', Factory);

    Factory.$inject = ['FormErrorsService'];

    function Factory(FormErrorsService) {
    	var _data = {
    		errors: null
    	};

    	var factory = {
    		errorCollection: _data,
            registration: registration,
            clear: clear
    	};

        return factory;

    	function registration (errors) {
    		_data.errors = FormErrorsService.format(errors);
            console.log(_data.errors);
    	}

        function clear () {
            _data.errors = null;
        }
    }
})();
