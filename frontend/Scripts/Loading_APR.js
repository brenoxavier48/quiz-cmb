const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);
const ROOMID = localStorage.getItem("roomId");
let level = localStorage.getItem('actualLevel');
let acabouExist = localStorage.getItem(`${level}`);


// O Loading é usado tanto de Answer para Classification, quanto de Classification para Question

socket.on('allUsersConnected', () => {
  window.location.href = "/pages/Quiz_APR.html";
});


const main = () => {
  // Versão 3.0
  // Ele passa por aqui qnd o timer não é 0 (?) SIM
  // Então, se veio de Answer com tempo: faz o mesmo qnd vai para Classification
  
  // Ele passa por aqui qnd o timer é 0, ou seja, a chave da fase foi criada no localStorage('localStorage.getItem(`${level}`)')
  // Então, se veio de Answer com timer zerado: muda fase no back, seta o novo tempo e segue para Classification
  if (acabouExist !== null) {
    socket.emit('changeDifficulty', ROOMID);
    // Acho que o erro agora está aqui!!!
    socket.emit('setTime', ROOMID);
    socket.emit('startGame', ROOMID);
    // socket.on('startedGame', () => {
    //   window.location.href = "/pages/Quiz_APR.html";
    // });
  }

  // Quando ele vem de Classification, só quer renderizar a próxima pergunta pq a mudança de fase no back acontece qnd vier de Answer timer zerado
    // Então se veio de Classification: starta o game e segue para Quiz
  socket.emit('connectAPR', ROOMID);
  socket.emit('startGame', ROOMID);
};

main();
