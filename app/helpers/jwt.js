var jwt = require('jsonwebtoken');

module.exports.createToken = function(user) {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
};

module.exports.verifyToken = function (token, cb) {
	jwt.verify(token, process.env.JWT_SECRET, function (err, decoded){
		if(err) {
			cb(err, false);
		} else {
			cb(false, decoded);
		}
	});
};
