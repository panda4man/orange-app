module.exports = function(io) {
	'use strict';
    io.on('connection', function(socket) {
        console.log('a user connected');

        socket.emit('welcome', 'Welcome to Orange Gaming!');

        //listeners
        socket.on('disconnect', function() {
            console.log('user disconnected');
        });
        socket.on('chat:typing', function() {
            socket.broadcast.emit('chat:typing');
        });
        socket.on('chat:typing-stopped', function() {
            socket.broadcast.emit('chat:typing-stopped');
        });
        socket.on('chat:message', function(msg) {
            console.log('message: ' + msg);
            socket.broadcast.emit('chat:message', msg);
        });
    });
};
