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
                template: '<div id="base" ui-view></div>',
                controller: 'BaseCtrl as Base'
            })
            /**
             * This state is used for views requiring a header and footer.
             * @type {String}
             */
            .state('app.master', {
                url: '',
                templateUrl: '/cache/layouts/master.html',
                abstract: true
            })
            /**
             * This state is used for views which only need a modal style such as login.
             * @type {String}
             */
            .state('app.simple', {
                url: '',
                templateUrl: '/cache/layouts/simple.html',
                abstract: true
            })
            .state('app.master.hangman', {
                url: '/hangman',
                title: 'Hangman',
                controller: 'HangmanCtrl as Hangman',
                templateUrl: '/cache/games/hangman/index.html'
            })
            .state('app.master.hangman-new', {
                url: '/hangman/new',
                title: 'Hangman | new',
                controller: 'HangmanCtrl as Hangman',
                templateUrl: '/cache/games/hangman/new.html'
            })
             .state('app.master.hangman-game-lobby', {
                url: '/hangman/:room/lobby',
                title: 'Hangman | Lobby',
                controller: 'HangmanCtrl as Hangman',
                templateUrl: '/cache/games/hangman/game_lobby.html'
            })
            .state('app.master.profile', {
                url: '/profile',
                title: 'Profile',
                controller: 'ProfileCtrl as Profile',
                templateUrl: '/cache/profile/index.html'
            })
            .state('app.master.profile-edit', {
                url: '/profile/edit',
                title: 'Profile | Edit',
                controller: 'ProfileCtrl as Profile',
                templateUrl: '/cache/profile/edit.html'
            })
            .state('app.simple.register', {
                url: '/register',
                title: 'Register',
                controller: 'RegisterCtrl as Register',
                templateUrl: '/cache/sessions/register.html'
            });

        $urlRouterProvider.otherwise('/profile');
    }
})();
