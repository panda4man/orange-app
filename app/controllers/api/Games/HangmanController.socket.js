var Hangman = require('../../../models/hangman');

module.exports.respond = function(endpoint, socket, errors, loading) {
    console.log('User connected: %s', socket.id);

    //Listeners
    socket.on('create', function(data) {
        loading(endpoint, socket, false, true, '');
        console.log(endpoint.sockets);
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
        Hangman.find({
            room: game
        }).populate('players').populate('owner').exec(function(err, game) {
            var game = game[0];
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
                    if (game.players.indexOf(player.id) > -1)
                        game.addPlayer(player);

                    //save the game and send the socket a message
                    game.save(function(err) {
                        if (err) {
                            loading(endpoint, socket, false, false, '');
                            errors.hangman(socket, err);
                        } else {
                            loading(endpoint, socket, false, false, '');

                            //player joins the game room
                            socket.join(game.room);

                            //let everyone already in the game know that someone joined
                            socket.broadcast.to(game.room).emit('game:joined', player);
                        }
                    });
                }
            }
        });
    });

    socket.on('leave', function(player, game) {
        loading(endpoint, socket, false, true, '');
        Hangman.findById(game.id).populate('players').exec(function(err, game) {
            if (err) {
                loading(endpoint, socket, false, false, '');
                errors.hangman(socket, err);
            } else {
                if (game) {
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

                            //tell everyone of the disconnection
                            socket.broadcast.to(game.room).emit('game:left', player);
                        }
                    });
                }
            }
        });
    });

    socket.on('game:typing', function() {
        socket.broadcast.emit('game:typing');
    });
    socket.on('game:typing-stopped', function() {
        socket.broadcast.emit('game:typing-stopped');
    });
    socket.on('game:message', function(msg) {
        console.log('message: ' + msg);
        socket.broadcast.emit('game:message', msg);
    });
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    //Emitters
    socket.emit('welcome', 'Welcome to Orange Gaming!');
}
