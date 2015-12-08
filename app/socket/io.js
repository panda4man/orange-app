var errors = require('../helpers/socketErrors'),
    loading = require('../helpers/socketLoading'),
    socketioJwt = require('socketio-jwt'),
    HangmanController = require('../controllers/api/Games/HangmanController.socket');

/**
 * Register all socket namepaces
 */
module.exports = function(io) {
    'use strict';
    /*
    var hangman = io.of('/hangman').on('connection', function(socket) {
        var games = {};
        HangmanController.respond(hangman, socket, games, errors, loading);
    });*/

	var hangman = io.of('/hangman').on('connection', socketioJwt.authorize({
		secret: process.env.JWT_SECRET,
		handshake: true
	})).on('authenticated', function (socket){
		var games = {};
        HangmanController.respond(hangman, socket, games, errors, loading);
	});

    var blackjack = io.of('/blackjack').on('connection', function(socket) {
        //TO DO
    });
};
