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
        required: true,
        type: String
    },
    password: {
        type: String,
        required: true
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
        unique: true
    },
    age: {
        type: Number,
        default: null
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
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
    this.set('name.first', split[0]);
    this.set('name.last', split[1]);
});

UserSchema.set('toJSON', {
    getters: true,
    virtuals: true
});
UserSchema.set('toObject', {
    getters: true,
    virtuals: true
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

UserSchema.methods.fill = function(data) {
    this.name = data.name.first + ' ' + data.name.last;
    this.username = data.username;
    this.email = data.email;
    this.age = data.age || null;
    this.password = data.password;
};

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
