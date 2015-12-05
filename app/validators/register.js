var validator = require('express-validator');

module.exports = function(req, res, next) {
    if(req.body.name){
        req.sanitize(req.body.name.first).trim();
        req.sanitize(req.body.name.last).trim();
    }

    req.checkBody('name.first', 'First name is required.').notEmpty();
    req.checkBody('name.last', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is invalid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    if(req.body.age)
        req.checkBody('password', 'Password is required').isInt();

    var errors = req.validationErrors();

    console.log(errors);

    if(errors){
    	res.status(400).json(errors);
    } else {
    	next();
    }

}
