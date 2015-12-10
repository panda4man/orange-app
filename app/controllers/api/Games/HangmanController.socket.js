var Hangman = require('../../../models/').hangman,
    socketHelper = require('../../../helpers/socket');

//Maybe use this array to store all the clients trying to join?
var _session = {
    players: [],
    room: '',
    player_limit: 1
};

module.exports.respond = function(endpoint, socket, sessions, loading) {
    console.log('User connected: %s', socket.id);
    //Listeners
    socket.on('create', function(data) {
        var game = new Hangman();
        game.fill(data);
        game.save(function(err) {
            if (err) {
                errors.hangman(socket, err);
            } else {
                //socket joins the game
                socket.join(game.room);

                //update session info
                _session.player_limit = game.player_limit;
                _session.players.push(game.owner);
                _session.room = game.room;

                //let everyone already in the game know that someone joined
                socket.broadcast.to(game.room).emit('game:joined', game.owner);

                //tell the client the game was created
                socket.emit('game:created', game);
            }
        });
    });

    //TODO
    //We have to figure out a way to handle the possibility of x number of users
    //all emitting a join at the same time and then the person who did it last
    //will be the person who actually joins since they will write to the database
    //last.
    socket.on('join', function(player, game) {
        console.log('%s is trying to join %s', player.id, game);
        if (_session.players.length < _session.player_limit) {
            if (_session.players.indexOf(player.id) < 0) {
                _session.players.push(player.id);
            }
            Hangman.findOne({
                room: game
            }).populate('players').populate('owner').exec(function(err, game) {
                if (err) {
                    errors.hangman(socket, err);
                } else {
                    //see if there is a slot available
                    if (game.player_limit == game.players.length) {
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
                                errors.hangman(socket, err);
                            } else {

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
        } else {
            socket.broadcast.to(_session.room).emit('game:full');
        }

    });

    socket.on('leave', function(player, game) {
        console.log('%s is leaving the game %s', player.id, game);
        _session.players = _session.players.filter(function(pl) {
            return pl != player.id;
        });
        if (_session.players.length == 0) {
            _session.room = '';
            _session.player_limit = 1;
        }
        Hangman.findOne({
            room: game
        }).populate('players').populate('owner').exec(function(err, game) {
            if (err) {
                errors.hangman(socket, err);
            } else {
                if (game) {
                    //If only one player left then we need to remove game
                    if (game.players.length == 1) {
                        game.remove(function(err) {
                            if (err) {
                                errors.hangman(socket, err);
                            } else {

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
                                socketHelper.errors.hangman(socket, err);
                            } else {

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

    socket.on('disconnect', function() {
        console.log('%s disconnected.', socket.id);
    });
}
