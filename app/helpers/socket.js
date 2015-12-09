var jwtHelper = require('../helpers/jwt'),
    _ = require('lodash'),
    _delay = 1000;

/**
 * This method handles authenticated the jwt.
 * @param  String   token   	the token we want to auth
 * @param  IO   	endpoint 	the endpoint we are doing work on
 * @param  Socket   socket   	the particular socket we are handling
 * @param  Function cb       	callback we return back to caller
 */
var authSocket = function(token, endpoint, socket, cb) {
    jwtHelper.verifyToken(token, function(err, success) {
        if (!err && success) {
            console.log("Authenticated socket ", socket.id);
            socket.auth = true;
            reconnectSockets(endpoint, socket);
            cb();
        }
        //we don't need an else since the timeout will catch
        //the unauthorized event
    });
};

var reconnectSockets = function(endpoint, socket) {
    _.forEach(endpoint.nsps, function(nsp) {
        if (_.findWhere(nsp.sockets, {
                id: socket.id
            })) {
            console.log("restoring socket to", nsp.name);
            nsp.connected[socket.id] = socket;
        }
    });
};

var disconnectSockets = function(endpoint) {
	console.log('calling disconnect sockets');
    _.forEach(endpoint.nsps, function(nsp) {
        nsp.on('connect', function(socket) {
            if (!socket.auth) {
                console.log("removing %s from %s", socket.id, nsp.name)
                delete nsp.connected[socket.id];
            } else {
            	console.log('do not need to dc the socket cuz it is authed');
            }
        });
    });
};

var triggerNoAuth = function(socket, delay) {
	console.log('loading the no auth');
    setTimeout(function unauthorized() {
        //If the socket didn't authenticate, disconnect it
        if (!socket.auth) {
            console.log("Auth timeout, disconnecting socket %s", socket.id);
            socket.disconnect('unauthorized');
        } else {
        	console.log('the socket was authed so do not need to dc');
        }
    }, delay || 1000);
};

module.exports = {
    authSocket: authSocket,
    reconnectSockets: reconnectSockets,
    disconnectSockets: disconnectSockets,
    authTimeout: triggerNoAuth,
    errors: {
    	hangman: function (socket, error) {
    		socket.emit('game:error', error);
    	}
    }
};
