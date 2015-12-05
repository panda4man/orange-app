var jwt = require('jsonwebtoken');

module.exports.createToken = function(user) {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
};
