const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const modal = document.getElementById('gameOverModal');
const winModal = document.getElementById('winModal');
const scoreSpan = document.getElementById('score');
const closeModal = document.getElementById('closeModal');
const continueButton = document.getElementById('continueButton');
const exitButton = document.getElementById('exitButton');
const closeWinModal = document.getElementById('closeWinModal');
const winContinueButton = document.getElementById('winContinueButton');
const winExitButton = document.getElementById('winExitButton');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const livesSpan = document.getElementById('lives');
const objectsSpan = document.getElementById('objects');
const timeSpan = document.getElementById('time');
const levelSpan = document.getElementById('level');

const gridSize = 20;
const canvasWidth = 800;
const canvasHeight = 600;
let snake = [{ x: 400, y: 300 }];
let dx = gridSize;
let dy = 0;
let food = getRandomFoodPosition();
let score = 0;
let gameOver = false;
let level = 1;
let lives = 3;
let objects = 0;

const snakeSpeed = 150; // Velocidad en milisegundos para el movimiento de la serpiente
const timerInterval = 1000; // 1 segundo en milisegundos

const levels = [
    { time: 60, foodRequired: 5 },
    { time: 90, foodRequired: 10 },
    { time: 120, foodRequired: 15 }
];
let timer = levels[level - 1].time;
let interval;
let timerIntervalID;

function getRandomFoodPosition() {
    const x = Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize;
    return { x, y };
}

function drawSnake() {
    ctx.fillStyle = 'lime';
    snake.forEach(part => ctx.fillRect(part.x, part.y, gridSize, gridSize));
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Regresar del lado opuesto si se sale del canvas
    if (head.x < 0) head.x = canvasWidth - gridSize;
    if (head.x >= canvasWidth) head.x = 0;
    if (head.y < 0) head.y = canvasHeight - gridSize;
    if (head.y >= canvasHeight) head.y = 0;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = getRandomFoodPosition();
        objects++;
        objectsSpan.textContent = objects;
        if (objects === levels[level - 1].foodRequired) {
            if (level === 3) {
                gameOver = true;
                showWinModal('Has Ganado', 'Ganaste con una puntuación de ' + objects);
            } else {
                level++;
                levelSpan.textContent = level;
                objects = 0;
                lives++;
                resetGame();
            }
        }
    } else {
        snake.pop();
    }
}

function checkCollision() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    return false;
}

function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    moveSnake();
    drawSnake();

    if (checkCollision()) {
        lives--;
        livesSpan.textContent = lives;
        if (lives === 0) {
            gameOver = true;
            showModal('Game Over', 'Perdiste todas tus vidas. Tu puntuación fue ' + objects);
        } else {
            resetGame();
        }
    }
}

function updateTimer() {
    if (gameOver) return;

    timer--;
    timeSpan.textContent = timer;

    if (timer <= 0) {
        lives--;
        if (lives <= 0) {
            lives = 0;
            gameOver = true;
            showModal('Game Over', 'El tiempo se agotó. Tu puntuación fue ' + objects);
        } else {
            resetGame();
        }
        livesSpan.textContent = lives;
    }
}

function showModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    scoreSpan.textContent = objects;
    modal.style.display = 'block';
}

function showWinModal(title, message) {
    document.getElementById('winModalTitle').textContent = title;
    winModal.style.display = 'block';
}

function resetGame() {
    clearInterval(interval);
    clearInterval(timerIntervalID);
    snake = [{ x: 400, y: 300 }];
    dx = gridSize;
    dy = 0;
    food = getRandomFoodPosition();
    objects = 0;
    timer = levels[level - 1].time;
    objectsSpan.textContent = objects;
    timeSpan.textContent = timer;
    interval = setInterval(update, snakeSpeed);
    timerIntervalID = setInterval(updateTimer, timerInterval);
}

document.addEventListener('keydown', event => {
    const { key } = event;
    if (key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -gridSize;
    } else if (key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = gridSize;
    } else if (key === 'ArrowLeft' && dx === 0) {
        dx = -gridSize;
        dy = 0;
    } else if (key === 'ArrowRight' && dx === 0) {
        dx = gridSize;
        dy = 0;
    }
});

closeModal.onclick = function() {
    modal.style.display = "none";
    resetGame();
};

continueButton.onclick = function() {
    modal.style.display = "none";
    resetGame();
};

exitButton.onclick = function() {
    window.close();
};

closeWinModal.onclick = function() {
    winModal.style.display = "none";
    resetGame();
};

winContinueButton.onclick = function() {
    winModal.style.display = "none";
    resetGame();
};

winExitButton.onclick = function() {
    window.close();
};

resetGame();
