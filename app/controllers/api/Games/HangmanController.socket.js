var Hangman = require('../../../models/hangman');

module.exports.respond = function(endpoint, socket, errors, loading) {
    console.log('User connected: %s', socket.id);

    //Listeners
    socket.on('create', function(data) {
        loading(endpoint, socket, false, true, '');
        var game = new Hangman();
        game.fill(data);
        game.save(function(err) {
            if (err) {
                loading(endpoint, socket, false, false, '');
                errors.hangman(socket, err);
            } else {
                //socket joins the game
                socket.join(game.room);

                //let everyone already in the game know that someone joined
                socket.broadcast.to(game.room).emit('game:joined', game.owner);

                //tell the client the game was created
                loading(endpoint, socket, false, false, '');
                socket.emit('game:created', game);
            }
        });
    });

    socket.on('join', function(player, game) {
        loading(endpoint, socket, false, true, '');
        console.log('%s is trying to join %s', player.id, game);
        Hangman.findOne({
            room: game
        }).populate('players').populate('owner').exec(function(err, game) {
            if (err) {
                loading(endpoint, socket, false, false, '');
                errors.hangman(socket, err);
            } else {
                //see if there is a slot available
                if (game.player_limit == game.players.length) {
                    loading(endpoint, socket, false, false, '');
                    errors.hangman(socket, 'No available player slots.');
                } else {
                    //add player to players list
                    if (!game.isPlaying(player)) {
                        console.log('found someone not in the game yet: %s', player.id);
                        game.addPlayer(player);
                    }

                    //save the game and send the socket a message
                    game.save(function(err) {
                        if (err) {
                            console.log('error happened on join');
                            loading(endpoint, socket, false, false, '');
                            errors.hangman(socket, err);
                        } else {
                            loading(endpoint, socket, false, false, '');

                            //player joins the game room
                            socket.join(game.room);

                            //let everyone already in the game know that someone joined
                            socket.broadcast.to(game.room).emit('game:joined', {
                                player: player,
                                game: game
                            });
                        }
                    });
                }
            }
        });
    });

    socket.on('leave', function(player, game) {
        console.log('%s is leaving the game %s', player.id, game);
        loading(endpoint, socket, false, true, '');
        Hangman.findOne({
            room: game
        }).populate('players').populate('owner').exec(function(err, game) {
            if (err) {
                loading(endpoint, socket, false, false, '');
                errors.hangman(socket, err);
            } else {
                if (game) {
                    //If only one player left then we need to remove game
                    if (game.players.length == 1) {
                        game.remove(function (err){
                            if(err){
                                loading(endpoint, socket, false, false, '');
                                errors.hangman(socket, err);
                            } else {
                                loading(endpoint, socket, false, false, '');

                                //disconnect from room
                                socket.leave(game.room);

                                //tell everyone in this namespace that the game
                                //ended
                                endpoint.emit('game:ended');
                            }
                        });
                    } else {
                        //remove player from game player id list
                        game.removePlayer(player);

                        game.save(function(err) {
                            if (err) {
                                loading(endpoint, socket, false, false, '');
                                errors.hangman(socket, err);
                            } else {
                                loading(endpoint, socket, false, false, '');

                                //disconnect from room
                                socket.leave(game.room);

                                //tell everyone in room of the disconnection
                                socket.broadcast.to(game.room).emit('game:leave', {
                                    player: player,
                                    game: game
                                });
                            }
                        });
                    }
                }
            }
        });
    });
}
