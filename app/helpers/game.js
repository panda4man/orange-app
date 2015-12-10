var _ = require('lodash');
module.exports = {
    addPlayer: function(player, game) {
        if (!_.some(game.players, {
                'id': player.id
            })) {
            console.log('Added player to the players list');
            game.players.push(player);
        }
    },
    removePlayer: function(game, player) {
        var i;
        if (_.some(game.players), {
                'id': player.id
            }) {
            console.log('Removing player %s from game %s', player.full_name, game.room);
            _.remove(game.players, {
                'id': player.id
            });
        } else {
            console.log('The player who left didn\'t actually exist??');
        }
    },
    noPlayers: function(game) {
        return game.players.length;
    },
    endGame: function (games, game) {
        console.log('ending the game');
        games[game.id].status = "done";
    },
    openSlot: function(limit, players) {
        return players.length < limit;
    },
    addGame: function(rooms, game) {
        console.log('Adding game: %s', game.room);
        if (!rooms[game.id]) {
            console.log('The game didn\'t already exist.');
            rooms[game.id] = game;
            rooms[game.id].players.push(game.owner);
            console.log(rooms[game.id]);
        }
    },
    find: function(games, id) {
        return games[id];
    },
    save: function(games, game) {
        games[game.id] = game;
    }
};
