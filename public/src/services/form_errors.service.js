(function () {
	'use strict';
	angular
	.module('orange.service.form_errors', [])
	.service('FormErrorsService', Service);

	Service.$inject = [];

	function Service () {
		var self = this;

		function _msgExists (key, array) {
			var x = 0;
			for(x; x < array.length; x++){
				if(array[x] === key){
					return true;
				}
				return false;
			}
		}

		self.format = function (errors) {
			var _errors = {};
			if(Object.prototype.toString.call(errors) === '[object Array]'){
				if(errors[0].hasOwnProperty('param') && errors[0].hasOwnProperty('msg')) {
					var x = 0;
					for(x; x < errors.length; x++){
						var _this_error = _errors[errors[x].param];
						if(_this_error){
							if(!_msgExists(errors[x].msg, _this_error))
								_errors[errors[x].param].push(errors[x].msg);
						} else {
							var name = errors[x].param;
							if(name == "name.first"){
								name = "first_name";
							} else if(name == "name.last"){
								name = "last_name";
							}
							
							_errors[name] = [errors[x].msg];
						}
					}
				}
			} else {
				console.log(JSON.stringify(errors));
			}
			return _errors;
		}
	}
})();