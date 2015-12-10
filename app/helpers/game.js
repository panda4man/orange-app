var _ = require('lodash'),
    mongoose = require('mongoose');

module.exports = {
    isPlaying: function(game, player) {
        return _.some(game.players, {
            id: player.id
        });
    },
    convertId: function (player) {
    	return mongoose.Types.ObjectId(player.id);
    }
};
