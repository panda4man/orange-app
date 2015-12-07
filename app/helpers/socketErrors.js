module.exports.hangman = function (socket, error){
	socket.emit('game:error', error);
}