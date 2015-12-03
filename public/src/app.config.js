(function() {
    'use strict';

    angular
        .module('orange.config', [])
        .config(Config);

    Config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function Config($stateProvider, $urlRouterProvider) {
    	$stateProvider
    	.state('app', {
    		url: '',
    		abstract: true,
            template: '<div ui-view></div>',
            controller: 'BaseCtrl as Base'
    	})
        .state('app.chat', {
            url: '/chat',
            controller: 'ChatCtrl as Base',
            templateUrl: '/cache/chat.html'
        });

        $urlRouterProvider.otherwise('/chat');
    }
})();
