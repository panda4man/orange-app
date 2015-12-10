var Hangman = require('../../../models/').hangman,
    socketHelper = require('../../../helpers/socket'),
    gameHelper = require('../../../helpers/game');

module.exports.respond = function(endpoint, socket, sessions) {
    //Add connection to 
    socketHelper.addConnection(sessions.connections, socket.id);
    socketHelper.syncData(sessions, function (err, success){
        if(err){
            socketHelper.errors.hangman(socket, err);
        } else {
            socket.emit('games:updated', socketHelper.formatGames(sessions.rooms));
        }
    });
    //Keeping the game creating async here b/c the unique validation should happen
    //synchronously enough to be safe...but maybe not in higher load.
    socket.on('create', function(data) {
        var game = new Hangman();
        game.fill(data);
        game.save(function(err) {
            if (err) {
                socketHelper.errors.hangman(socket, err);
            } else {
                //add game to session
                var _game = game;
                _game.owner = data.owner;
                gameHelper.addGame(sessions.rooms, _game);

                //socket joins the game
                socket.join(game.room);

                //let everyone already in the game know that someone joined
                socket.broadcast.to(game.room).emit('game:joined', game.owner);

                //Updated everyone's games list
                endpoint.emit('games:updated', sessions.rooms);

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
        var _game = gameHelper.find(sessions.rooms, game);
        if (_game) {
            console.log('Found the game id: %s & room: %s', _game.id, _game.room);
            if (gameHelper.openSlot(_game.player_limit, _game.players)) {
                console.log('There was an open slot. Added: %s', player.full_name);
                gameHelper.addPlayer(player, _game);
                gameHelper.save(sessions.rooms, _game);
                socket.join(_game.room);
                endpoint.in(_game.room).emit('game:joined', {
                    player: player,
                    game: _game
                });
                endpoint.emit('games:updated', sessions.rooms);
            } else {
                console.log('There are not slots available for %s.', player.full_name);
                socketHelper.errors.hangman(socket, 'No open slots available, sorry!');
            }
        } else {
            console.log('Game does not exist anymore.');
            socketHelper.errors.hangman(socket, 'This game does not exist any more.');
        }
        /*
        console.log('%s is trying to join %s', player.id, game);
        if (_session.players.length < _session.player_limit) {
            if (_session.players.indexOf(player.id) < 0) {
                _session.players.push(player.id);
            }
            Hangman.findOne({
                room: game
            }).populate('players').populate('owner').exec(function(err, game) {
                if (err) {
                    socketHelper.errors.hangman(socket, err);
                } else {
                    //see if there is a slot available
                    if (game.player_limit == game.players.length) {
                        socketHelper.errors.hangman(socket, 'No available player slots.');
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
                                socketHelper.errors.hangman(socket, err);
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
    */
    });

    socket.on('leave', function(player, game) {
        console.log('%s is leaving the game %s', player.id, game);
        var _game = gameHelper.find(sessions.rooms, game);
        if(_game){
            gameHelper.removePlayer(_game, player);
            if(gameHelper.noPlayers, _game){
                gameHelper.endGame(sessions.rooms, _game);
            } else {
                gameHelper.save(sessions.rooms, _game);
            }
            endpoint.emit('games:updated', sessions.rooms);
        } else {
            console.log('Leaving a game that did not exist');
        }

        /*
        Hangman.findOne({
            room: game
        }).populate('players').populate('owner').exec(function(err, game) {
            if (err) {
                socketHelper.errors.hangman(socket, err);
            } else {
                if (game) {
                    //If only one player left then we need to remove game
                    if (game.players.length == 1) {
                        game.remove(function(err) {
                            if (err) {
                                socketHelper.errors.hangman(socket, err);
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
*/
    });

    socket.on('games:request', function () {
        console.log('received a game list update request');
        socket.emit('games:updated', socketHelper.formatGames(sessions.rooms));
    });

    socket.on('disconnect', function() {
        socketHelper.removeConnection(sessions.connections, socket.id);
    });
}
