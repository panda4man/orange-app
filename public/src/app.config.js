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
                title: 'Chat',
                controller: 'ChatCtrl as Base',
                templateUrl: '/cache/chat.html'
            })
            .state('app.profile', {
                url: '/profile',
                title: 'Profile',
                controller: 'ProfileCtrl as Profile',
                templateUrl: '/cache/profile/index.html'
            })
            .state('app.profile-edit', {
                url: '/profile/edit',
                title: 'Profile | Edit',
                controller: 'ProfileCtrl as Profile',
                templateUrl: '/cache/profile/edit.html'
            });

        $urlRouterProvider.otherwise('/profile');
    }
})();
