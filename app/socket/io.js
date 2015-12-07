var errors = require('../helpers/socketErrors');
var loading = require('../helpers/socketLoading');
var HangmanController = require('../controllers/api/Games/HangmanController.socket');

/**
 * Register all socket namepaces
 */
module.exports = function(io) {
	'use strict';
    var hangman = io.of('/hangman').on('connection', function(socket) {
        HangmanController.respond(hangman, socket, errors, loading);
    });

    var blackjack = io.of('/blackjack').on('connection', function (socket){
        //TO DO
    });
};
