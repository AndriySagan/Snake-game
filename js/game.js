// Отримання посилань на необхідні HTML елементи
const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.querySelector(".game-score");
const startBtn = document.querySelector(".game-start");
const resetBtn = document.querySelector(".game-reset");

// Завантаження зображень.
const snakeImg = new Image();
const foodImg = new Image();
snakeImg.src = "/img/snake.png";
foodImg.src = "/img/cherry.png";

// Розміри поля гри та сегментів змійки
const gridSize = 20;
const tileCount = 20;

// Змійка та їжа
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 10 };

// Рух змійки по полю
let dx = 0;
let dy = 0;

// Затримка між оновленнями гри (менше значення - швидший рух змійки)
let delay = 200; // Змініть це значення за необхідності

// Очки
let score = 0;

// Функція малювання змійки та їжі
function draw() {
  // Очищення поля
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Малювання змійки
  snake.forEach((segment) => {
    ctx.drawImage(snakeImg, segment.x * gridSize, segment.y * gridSize);
  });

  // Малювання їжі
  ctx.drawImage(foodImg, food.x * gridSize, food.y * gridSize);

  // Малювання балів
  scoreDisplay.textContent = `Бали: ${score}`;
}

// Функція оновлення гри
function update() {
  // Рух змійки
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  // Перевірка, чи їсть змійка їжу
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } else {
    snake.pop();
  }

  // Перевірка на зіткнення з межами поля або самою собою
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= tileCount ||
    head.y >= tileCount ||
    checkCollision(head)
  ) {
    gameOver();
    return;
  }

  draw();
  timerId = setTimeout(update, delay); // Запуск нового таймера зі зміненою швидкістю
}

// Функція перевірки зіткнення з самою собою
function checkCollision(head) {
  return snake
    .slice(1)
    .some((segment) => segment.x === head.x && segment.y === head.y);
}

// Функція, яка викликається при закінченні гри
function gameOver() {
  const finalScore = document.getElementById("final-score");
  finalScore.textContent = score;

  const gameOverMessage = document.getElementById("game-over-message");
  gameOverMessage.style.display = "block";

  saveResult();

  snake = [{ x: 10, y: 10 }];
  food = { x: 15, y: 10 };
  dx = 0;
  dy = 0;
  score = 0;
  draw();
}

// Обробники подій для кнопок "Старт" та "Перезапуск"
startBtn.addEventListener("click", () => {
  dx = 1;
  dy = 0;
  update();
});

resetBtn.addEventListener("click", () => {
  snake = [{ x: 10, y: 10 }];
  food = { x: 15, y: 10 };
  dx = 0;
  dy = 0;
  score = 0;
  draw();
});

// Перехоплення подій клавіатури для керування змійкою
document.addEventListener("keydown", (event) => {
  const keyPressed = event.key;
  if (keyPressed === "ArrowUp" && dy !== 1) {
    dx = 0;
    dy = -1;
  } else if (keyPressed === "ArrowDown" && dy !== -1) {
    dx = 0;
    dy = 1;
  } else if (keyPressed === "ArrowLeft" && dx !== 1) {
    dx = -1;
    dy = 0;
  } else if (keyPressed === "ArrowRight" && dx !== -1) {
    dx = 1;
    dy = 0;
  }
});

// Змінні для збереження історії результатів
const lastScores = [];
const bestScores = [];

// Збереження результатів
function saveResult() {
  if (lastScores.length === 10) {
    lastScores.shift();
  }

  lastScores.push(score);
  lastScores.sort((a, b) => b - a);

  if (bestScores.length < 3 || score > bestScores[bestScores.length - 1]) {
    bestScores.push(score);
    bestScores.sort((a, b) => b - a);
    if (bestScores.length > 3) {
      bestScores.pop();
    }
  }

  updateHistory();
}

// Оновлення відображення історії результатів
function updateHistory() {
  const lastScoresList = document.querySelector(".last-scores");
  const bestScoresList = document.querySelector(".best-scores");

  // Останні 10 результатів
  lastScoresList.innerHTML = "";
  lastScores.forEach((result, index) => {
    const li = document.createElement("li");
    li.textContent = `${
      index + 1
    }.) Бали:${result} (Дата: ${getCurrentDate()})`;
    lastScoresList.appendChild(li);
  });

  // 3 найкращих результати
  bestScoresList.innerHTML = "";
  bestScores.forEach((result, index) => {
    const li = document.createElement("li");
    li.textContent = `${
      index + 1
    }.) Бали:${result} (Дата: ${getCurrentDate()})`;
    bestScoresList.appendChild(li);
  });
}

// Отримання поточної дати у форматі дд.мм.рр - гг.хх
function getCurrentDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} - ${hours}:${minutes}`;
}

// Функція, яка викликається при закінченні гри
function gameOver() {
  const finalScore = document.getElementById("final-score");
  finalScore.textContent = score;

  const gameOverMessage = document.getElementById("game-over-message");
  gameOverMessage.style.display = "block";

  saveResult();

  snake = [{ x: 10, y: 10 }];
  food = { x: 15, y: 10 };
  dx = 0;
  dy = 0;
  score = 0;
  draw();
}

// Початкове малювання гри та оновлення історії результатів
draw();
updateHistory();

// Функція, яка викликається при натисканні на кнопку "Перезапуск"
function restartGame() {
  // Зупинити старий таймер
  clearTimeout(timerId);

  // Приховати напис про програш
  const gameOverMessage = document.getElementById("game-over-message");
  gameOverMessage.style.display = "none";

  // Очистити поле canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Перезавантажити параметри гри
  snake = [{ x: 10, y: 10 }];
  food = { x: 15, y: 10 };
  dx = 0;
  dy = 0;
  score = 0;

  // Перезапустити гру
  draw();
  update();
}

// Обробник події для кнопки "Перезапуск"
resetBtn.addEventListener("click", restartGame);

// Змінна для збереження ID поточного таймеру
let timerId;

// Функція, яка викликається при натисканні на кнопку "Старт"
function startGame() {
  // Зупинити та очистити попередній таймер
  clearTimeout(timerId);

  dx = 1;
  dy = 0;
  const gameOverMessage = document.getElementById("game-over-message");
  gameOverMessage.style.display = "none"; // Приховати напис про програш
  update();
}

// Обробник події для кнопки "Старт"
startBtn.addEventListener("click", startGame);
