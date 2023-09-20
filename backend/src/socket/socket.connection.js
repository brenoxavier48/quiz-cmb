const room = require('./socket.room');
const game = require('./socket.game');
const question = require('./socket.question');

const connection = (socket) => {

  // Room events
  socket.on('createRoom', room.createRoom);
  socket.on('joinRoom', room.joinRoom);

  // Game events
  socket.on('startGame', game.startGame);

  // Question events
  socket.on('sendQuestion', question.sendQuestion);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
}

module.exports = connection;