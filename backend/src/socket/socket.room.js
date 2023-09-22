const userUtils = require('../utils/users');

const createRoom = (socket) => (room) => {
  userUtils.userWrite(room, { users: [], answered: [], difficulty: 1 });
  socket.join(room);

  socket.emit('sendLevel', 'facil');
}

const changeLevel = (socket) => (newLevel) => {
  socket.on('sendLevel', (newLevel) =>{
    const actualRoom = userUtils.userRead();



    // seto a dificuldade de cada usuário pra o novo level
    let newLevelRoom = actualRoom.difficulty === "facil" ? actualRoom[difficulty] = 2 : actualRoom[difficulty] = 3;

    // Reescrevo o arquivo
    userUtils.userWrite(newLevelRoom);

    // emito send level na nova fase
    socket.emit('sendLevel', )
  });
}

const joinRoom = (socket) => (schoolName, roomId) => {
  const rooms = userUtils.userRead();
  const users = rooms[roomId].users;
  const user = users.find((user) => user.schoolName === schoolName);
  if (user) {
    socket.emit('schoolNameNotExists');
    return;
  }
  // Todos os usuários já começam com 10 pontos
  users.push({ id: users.length + 1, schoolName, points: 10 });

  userUtils.userWrite(roomId, { ...rooms[roomId], users });
  socket.join(roomId);
  console.log(`User ${schoolName} connected to room ${roomId}`);
  socket.to(roomId).emit('userConnected', schoolName);
}

const connectAPR = (socket) => (roomId) => {
  socket.join(roomId);
}

const connectAPRAnswer = (socket) => (roomId) => {
  socket.join(roomId);
  socket.broadcast.to(roomId).emit('getAnswer');
}

const connectAPRClassification = (socket) => (roomId) => {
  socket.join(roomId);
  socket.broadcast.to(roomId).emit('getClassification', roomId);
}

let waitingUsers = [];
const connectAnswer = (socket) => (roomId) => {
  socket.join(roomId);
  const room = userUtils.userRead()[roomId];
  waitingUsers.push(roomId);

  if (waitingUsers.length === room.users.length) {

    socket.to(roomId).emit('showAnswer', room.atualQuestion);
    waitingUsers = [];
  }
}

const connectClassification = (socket) => (roomId) => {
  const room = userUtils.userRead()[roomId];
  waitingUsers.push(roomId);
  socket.join(roomId);
  console.log(waitingUsers, room.users);
  if (waitingUsers.length === room.users.length) {
    socket.to(roomId).emit('showClassificationAPR', room.users);
    waitingUsers = [];
  }
}

let connectedUsers = [];
const enterRoom = (socket) => (roomId, schoolName) => {
  const users = userUtils.userRead()[roomId].users;
  connectedUsers.push(schoolName);
  socket.join(roomId);
  if (connectedUsers.length === users.length) {
    socket.to(roomId).emit('allUsersConnected');
    connectedUsers = [];
  }
}

const clearConnections = () => () => {
  connectedUsers = [];
}

module.exports = {
  createRoom,
  joinRoom,
  enterRoom,
  clearConnections,
  connectAPR,
  connectAnswer,
  connectAPRAnswer,
  connectAPRClassification,
  connectClassification
}
