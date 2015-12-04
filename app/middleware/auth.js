var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    var token = req.headers['Authorization'];
    if(!token) {
        return res.status(403).json({
            success: false,
            message: "Missing auth header."
        });
    }

    var parts = token.split(' ');

    // decode token
    if (token.length) {
        // verifies secret and checks exp
        jwt.verify(parts[1], process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
}
