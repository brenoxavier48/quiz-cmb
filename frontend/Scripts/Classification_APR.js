const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);
const ROOMID = localStorage.getItem("roomId");

const showClassification = (usersList) => {
  const schoolList = document.getElementById('schoolList');
  usersList.forEach((user) => {
    const classificationDiv = document.createElement('div');
    classificationDiv.className = 'classificationDiv';
    const classificationSpan = document.createElement('span');
    classificationSpan.className = 'classificationSpan';
    classificationSpan.textContent = user.schoolName;
    classificationSpan.id = user.schoolName;
    const classificationPoints = document.createElement('span');
    classificationPoints.className = 'classificationPoints';
    classificationPoints.textContent = user.points;
    classificationPoints.id = user.points;
    classificationDiv.appendChild(classificationSpan);
    classificationDiv.appendChild(classificationPoints);
    schoolList.appendChild(classificationDiv);
  });
}

socket.on('showClassificationAPR', (usersList) => {
  document.getElementById("loading").remove();
  showClassification(usersList);
  socket.emit('sendClassification', ROOMID, usersList);
});

socket.on('receiveTimer', ({ endTime }) => {
  totalTimer(endTime);
});

let nextButtonLink = "/pages/Loading_APR.html";
const main = () => {
  socket.emit('connectAPRClassification', ROOMID);

  const nextButton = document.getElementById("botaoAvancar");
  nextButton.addEventListener('click', () => {
    window.location.href = nextButtonLink;
  });
};

main();

let totalTimerInterval;
function totalTimer(endTime) {
  const actualTime = new Date().getTime();
  const timeLeft = Math.round((endTime - actualTime) / 1000);
  var hours = 0;
  var minutes = Math.floor(timeLeft / 60);
  var seconds = timeLeft % 60;
  // Novo
  // var ele = document.getElementById('total-timer');
  var totalTimerInterval = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        hours--;
        minutes = 59;
      } else {
        minutes--;
      }
      seconds = 59;
    } else {
      seconds--;
    }

    hours < 0 ? hours = 0 : hours;
    minutes < 0 ? minutes = 0 : minutes;
    seconds < 0 ? seconds = 0 : seconds;

    if (hours === 0 && minutes === 0 && seconds === 0) {
      clearInterval(totalTimerInterval);
      // aqui na vdd deve renderizar a as perguntas no próximo nível
      nextButtonLink = "/pages/Quiz_APR.html";
      console.log('Função de ir pra página de troca de dificuldade', nextButtonLink);
    }

    // Novo
    // var hoursStr = hours.toString().padStart(2, '0');
    // var minutesStr = minutes.toString().padStart(2, '0');
    // var secondsStr = seconds.toString().padStart(2, '0');

    // Novo
    // ele.setAttribute('aria-timer', endTime - new Date().getTime())
    // ele.innerHTML = hoursStr + ':' + minutesStr + ':' + secondsStr;
  }, 1000);
};
