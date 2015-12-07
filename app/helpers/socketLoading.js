/**
 * Global loading message service for socket.io
 * @param  {[type]}  endpoint    io connection
 * @param  {[type]}  socket      specific client
 * @param  Boolean  to_room     broadcast to the whole room or just the client
 * @param  Boolen is_starting either process is starting or just finished
 * @param  Object data any data we want to display in the loading message
 */
module.exports = function (endpoint, socket, to_room, is_starting, data) {
	if(is_starting){
		console.log('loading is starting');
		if(to_room){
			endpoint.emit('loading:start', 'Working on your request.');
		} else {
			socket.emit('loading:start', 'Working on your request');
		}
	} else {
		console.log('loading is done');
		if(to_room){
			endpoint.emit('loading:done', 'Finished working on your request.');
		} else {
			socket.emit('loading:done', 'Finished working on your request');
		}
	}
}