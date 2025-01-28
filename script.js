const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
const courtColor = '#444';
const netColor = '#fff';

let player1Y = canvas.height / 2 - paddleHeight / 2;
let player2Y = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

const playerSpeed = 8;
let player1Score = 0;
let player2Score = 0;
let smoothnessFactor = 10;
let player1Velocity = 0;
let player2Velocity = 0;

let isSinglePlayer = true;

const smoothnessSlider = document.getElementById('smoothness');
smoothnessSlider.addEventListener('input', (e) => {
  smoothnessFactor = parseInt(e.target.value);
});

const singlePlayerButton = document.getElementById('singlePlayerButton');
const doublePlayerButton = document.getElementById('doublePlayerButton');

singlePlayerButton.addEventListener('click', () => {
  isSinglePlayer = true;
  singlePlayerButton.classList.add('active');
  doublePlayerButton.classList.remove('active');
});

doublePlayerButton.addEventListener('click', () => {
  isSinglePlayer = false;
  doublePlayerButton.classList.add('active');
  singlePlayerButton.classList.remove('active');
});

function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}

function drawText(text, x, y, fontSize = '20px') {
  ctx.fillStyle = '#fff';
  ctx.font = `${fontSize} Arial`;
  ctx.fillText(text, x, y);
}

function drawCourt() {
  drawRect(0, 0, canvas.width, canvas.height, courtColor);

  ctx.strokeStyle = netColor;
  ctx.setLineDash([10, 15]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX *= -1;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCourt();

  drawRect(10, player1Y, paddleWidth, paddleHeight, '#fff');
  drawRect(canvas.width - 20, player2Y, paddleWidth, paddleHeight, '#fff');

  drawCircle(ballX, ballY, ballSize, '#fff');

  drawText(player1Score, canvas.width / 4, 50);
  drawText(player2Score, (3 * canvas.width) / 4, 50);

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY >= canvas.height) {
    ballSpeedY *= -1;
  }

  if (
    (ballX <= 20 && ballY >= player1Y && ballY <= player1Y + paddleHeight) ||
    (ballX >= canvas.width - 20 && ballY >= player2Y && ballY <= player2Y + paddleHeight)
  ) {
    ballSpeedX *= -1;
  }

  if (ballX < 0) {
    player2Score++;
    resetBall();
  } else if (ballX > canvas.width) {
    player1Score++;
    resetBall();
  }

  if (isSinglePlayer) {
    player2Y += (ballY - (player2Y + paddleHeight / 2)) * 0.1;
  } else {
    player2Y += player2Velocity;
    if (player2Y < 0) player2Y = 0;
    if (player2Y > canvas.height - paddleHeight) player2Y = canvas.height - paddleHeight;
  }

  player1Y += player1Velocity;
  if (player1Y < 0) player1Y = 0;
  if (player1Y > canvas.height - paddleHeight) player1Y = canvas.height - paddleHeight;

  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    player1Velocity = -playerSpeed;
  } else if (e.key === 'ArrowDown') {
    player1Velocity = playerSpeed;
  }

  if (!isSinglePlayer) {
    if (e.key === 'w') {
      player2Velocity = -playerSpeed;
    } else if (e.key === 's') {
      player2Velocity = playerSpeed;
    }
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    player1Velocity = 0;
  }

  if (!isSinglePlayer && (e.key === 'w' || e.key === 's')) {
    player2Velocity = 0;
  }
});

gameLoop();
