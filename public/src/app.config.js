(function() {
    'use strict';

    angular
        .module('orange.config', ['orange.constants'])
        .config(Config);

    Config.$inject = ['$stateProvider', '$urlRouterProvider', '$authProvider', 'Config'];

    function Config($stateProvider, $urlRouterProvider, $authProvider, Config) {
        $authProvider.baseUrl = Config.baseUrl;
        $authProvider.loginUrl = '/auth';
        $stateProvider
            .state('app', {
                url: '',
                abstract: true,
                templateUrl: '/cache/base.html',
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
