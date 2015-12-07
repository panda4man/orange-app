// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    idvalidator = require('mongoose-id-validator'),
    uniqueValidator = require('mongoose-unique-validator');

var GameSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        required: true,
        type: String,
        enum: ['created', 'in_progress', 'done'],
        index: true
    },
    room: {
        required: true,
        index: true,
        type: String,
        unique: true
    },
    player_limit: {
        min: 0,
        max: 10,
        required: true,
        type: Number
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

GameSchema.methods.fill = function(data) {
    this.owner = mongoose.Types.ObjectId(data.owner);
    this.room = data.room;
    this.status = data.status;
    this.player_limit = data.player_limit;
    if(data.players && data.players.length){
        this.players = data.players;
    }
};

GameSchema.methods.isPlaying = function (player){
    var x = 0;
    var _player = null;
    for(x; x < this.players.length; x++){
        _player = this.players[x];
        if(_player.id == player.id){
            return true;
        }
    }
    return false;
};

GameSchema.methods.addPlayer = function(player) {
    if (typeof player == "object")
        this.players.push(mongoose.Types.ObjectId(player.id));
    else
        this.players.push(mongoose.Types.ObjectId(player));
};

GameSchema.methods.removePlayer = function(player) {
    this.players = this.players.filter(function (pl){
        return pl.id != player.id;
    });

    //if player who is leaving is owner
    //assign new owner
    if(player.id == this.owner.id){
        this.owner = this.players[0]._id;
    }
};

/**
 * Handle the foreign key references
 */
GameSchema.plugin(idvalidator);

/**
 * Handle the unique validation
 */
GameSchema.plugin(uniqueValidator);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Hangman', GameSchema);
