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
    players: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}]
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

GameSchema.methods.fill = function (data){
	this.owner = mongoose.Types.ObjectId(data.owner);
	this.room = data.room;
	this.status = data.status;
	this.player_limit = data.player_limit;
	this.player = data.players;
};

GameSchema.methods.addPlayer = function (player){
	this.players.push(mongoose.Types.ObjectId(player.id));
}

GameSchema.methods.removePlayer = function (player){
	var i = this.players.indexOf(player.id);
	if(i != -1){
		this.players.splice(i, 1);
	}
}

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