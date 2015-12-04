// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    validator = require('validator'),
    uniqueValidator = require('mongoose-unique-validator'),
    SALT_WORK_FACTOR = 12;

var UserSchema = new Schema({
    name: {
        first: String,
        last: String,
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true/*,
        select: false*/
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, 'invalid email'],
        index: true,
        unique: true,
        index: true
    },
    age: {
        type: Number,
        default: null
    }
});

/**
 * Mutators
 * @return {[type]}   [description]
 */
UserSchema.virtual('name.full').get(function() {
    return this.name.first + ' ' + this.name.last;
}).set(function(name) {
    var split = name.split(' ');
    this.name.first = split[0];
    this.name.last = split[1];
});

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.method('toJSON', function() {
    var user = this.toObject();
    delete user.__v;
    delete user.password;
    delete user._id;
    return user;
});

UserSchema.set('toObject', {
    getters: true,
    virtuals: true
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) cb(err, false);
        cb(null, isMatch);
    });
};

/**
 * Handle unique validation.
 */
UserSchema.plugin(uniqueValidator);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', UserSchema);
