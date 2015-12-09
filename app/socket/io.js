var errors = require('../helpers/socketErrors'),
    loading = require('../helpers/socketLoading'),
    jwtHelper = require('../helpers/jwt'),
    socketHelper = require('../helpers/socket'),
    HangmanController = require('../controllers/api/Games/HangmanController.socket');

/**
 * Register all socket namepaces
 */
module.exports = function(io) {
    'use strict';

    /**
     * I implemented a custom auth protocol outlined in this blog
     * https://facundoolano.wordpress.com/2014/10/11/better-authentication-for-socket-io-no-query-strings/
     *
     * It allows us to authenticate a socket without passing the jwt token as a 
     * query string where it can be cached and picked up by sniffers
     */

    //Any sockets that aren't authed we need to remove from 
    //global connected array
    socketHelper.disconnectSockets(io);

    var hangman = io.of('/hangman').on('connection', function(socket) {
        var sessions = {};
        socket.auth = false;
        socket.on('authenticate', function(data) {
            socketHelper.authSocket(data.token, io, socket, function() {
                //Pass off controll to hangman socket controller
                console.log('Auth was good so we pass along control');
                HangmanController.respond(hangman, socket, sessions, loading);
            });
        });

        socketHelper.authTimeout(socket);
    });

    var blackjack = io.of('/blackjack').on('connection', function(socket) {
        //TO DO
    });
};
