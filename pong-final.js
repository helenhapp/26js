// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 1. НАЛАШТУВАННЯ
// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦

// Полотно
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const gameWidth = canvas.width; // ширина гри
const gameHeight = canvas.height; // висота гри

// Рахунок гравців
const score1Element = document.querySelector("#s1");
let score1 = 0;
const score2Element = document.querySelector("#s2");
let score2 = 0;

const WINNING_SCORE = 3; // Граємо до 3-x очок!

// Кнопка для запуску гри
const startBtn = document.querySelector("#startBtn");

// Ракетка 1 (ліва)
const paddle1 = {
  x: 0,
  y: 0,
  width: 25,
  height: 95,
  speed: 9,
  color: "orangered",
};

// Ракетка 2 (права)
const paddle2 = {
  x: gameWidth - 25,
  y: gameHeight - 95,
  width: 25,
  height: 95,
  speed: 5,
  color: "limegreen",
};

// М'яч
const ball = {
  x: gameWidth / 2,
  y: gameHeight / 2,
  radius: 10,
  color: "darkblue",
  velocityX: 5,
  velocityY: 5,
  baseSpeed: 5, // Початкова швидкість
  maxSpeed: 7, // Ліміт швидкості
};

// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 2. КЕРУВАННЯ
// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦

// Слідкуємо за тим, які клавіші натиснуті

const keys = {
  KeyW: false,
  KeyS: false,
};

window.addEventListener("keydown", (event) => {
  if (event.code in keys) keys[event.code] = true;
});

window.addEventListener("keyup", (event) => {
  if (event.code in keys) keys[event.code] = false;
});

// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 3. ЛОГІКА ГРИ
// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦

// Рухаємо ракетки, але не даємо їм вийти за межі полотна
function movePaddles() {
  // --- ЛЮДИНА (Ракетка 1) ---
  const p1CanMoveUp = paddle1.y > 0;
  const p1CanMoveDown = paddle1.y < gameHeight - paddle1.height;
  if (keys.KeyW && p1CanMoveUp) paddle1.y -= paddle1.speed;
  if (keys.KeyS && p1CanMoveDown) paddle1.y += paddle1.speed;

  // --- КОМП'ЮТЕР (Ракетка 2) ---
  const p2CanMoveUp = paddle2.y > 0;
  const p2CanMoveDown = paddle2.y < gameHeight - paddle2.height;
  const p2Center = paddle2.y + paddle2.height / 2;
  // Щоб дії бота не були ідеально точні (бо його неможливо буде перемогти)
  const botSeesBall = ball.x > gameWidth / 2;
  if (botSeesBall) {
    if (ball.y < p2Center && p2CanMoveUp) paddle2.y -= paddle2.speed;
    else if (ball.y > p2Center && p2CanMoveDown) paddle2.y += paddle2.speed;
  }

  // --- КОМП'ЮТЕР (Ракетка 2) ---
  // const p2CanMoveUp = paddle2.y > 0;
  // const p2CanMoveDown = paddle2.y < gameHeight - paddle2.height;
  // if (ball.y < p2Center && p2CanMoveUp) paddle2.y -= paddle2.speed;
  // else if (ball.y > p2Center && p2CanMoveDown) paddle2.y += paddle2.speed;
}

// Рухаємо мʼяч
function moveBall() {
  // Зміна координат
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
}

// Відбивання від стелі та підлоги
function checkWallBounces() {
  const hitTop = ball.y - ball.radius < 0;
  const hitBottom = ball.y + ball.radius > gameHeight;
  if (hitTop || hitBottom) ball.velocityY *= -1;
}

// Перевірємо зіткнення мʼяча та ракетки
function checkCollision(ball, paddle) {
  // Визначаємо краї м'яча
  const ballTop = ball.y - ball.radius;
  const ballBottom = ball.y + ball.radius;
  const ballLeft = ball.x - ball.radius;
  const ballRight = ball.x + ball.radius;

  // Визначаємо краї ракетки
  const paddleLeft = paddle.x;
  const paddleRight = paddle.x + paddle.width;
  const paddleTop = paddle.y;
  const paddleBottom = paddle.y + paddle.height;

  // Перевіряємо, чи вони перетинаються
  const overlapX = ballRight >= paddleLeft && ballLeft <= paddleRight;
  const overlapY = ballBottom >= paddleTop && ballTop <= paddleBottom;

  // Повертаємо результат (true або false)
  return overlapX && overlapY;
}

// Відбивання від ракеток
function checkPaddleBounces() {
  const isLeftHalf = ball.x < gameWidth / 2;
  const activePaddle = isLeftHalf ? paddle1 : paddle2;
  const isCollision = checkCollision(ball, activePaddle);
  const a = 0.2;
  if (isCollision) {
    // 1. ПРИСКОРЕННЯ: Додаємо швидкість, якщо ми ще не на максимумі
    if (Math.abs(ball.velocityX) < ball.maxSpeed) {
      // Збільшуємо швидкість по осі X
      if (ball.velocityX > 0) ball.velocityX += a;
      else ball.velocityX -= a;

      // Збільшуємо швидкість по осі Y
      if (ball.velocityY > 0) ball.velocityY += a;
      else ball.velocityY -= a;
    }

    // 2. ВІДБИВАННЯ: Змінюємо напрямок
    if (isLeftHalf) {
      ball.velocityX = Math.abs(ball.velocityX);
      ball.x = activePaddle.x + activePaddle.width + ball.radius; // Виштовхуємо м'яч з лівої ракетки
    } else {
      ball.velocityX = -Math.abs(ball.velocityX);
      ball.x = activePaddle.x - ball.radius; // Виштовхуємо м'яч з правої ракетки
    }
  }
}

// Якщо м'яч вилетів за екран — це гол
function checkScoring() {
  const pastLeftWall = ball.x + ball.radius < 0;
  const pastRightWall = ball.x - ball.radius > gameWidth;

  if (pastLeftWall || pastRightWall) {
    // Оновлюємо рахунок
    const isLeftHalf = ball.x < gameWidth / 2;
    isLeftHalf ? score2++ : score1++;
    score1Element.textContent = score1;
    score2Element.textContent = score2;

    resetBall();
  }
}

// Повертаємо м'яч у центр полотна та скидаємо швидкість
function resetBall() {
  ball.x = gameWidth / 2;
  ball.y = gameHeight / 2;

  // Скидаємо швидкість по X і віддаємо м'яч тому, хто пропустив
  if (ball.velocityX > 0) ball.velocityX = -ball.baseSpeed;
  else ball.velocityX = ball.baseSpeed;

  // Скидаємо швидкість по Y, зберігаючи напрямок
  if (ball.velocityY > 0) ball.velocityY = ball.baseSpeed;
  else ball.velocityY = -ball.baseSpeed;
}

// Завершення гри
function gameOver() {
  // Використовуємо setTimeout, щоб браузер встиг намалювати останній кадр (м'яч у центрі)
  setTimeout(function() {
    // Визначаємо переможця і виводимо повідомлення
    if (score1 === WINNING_SCORE) alert(`Вітаю! Ви перемогли 🎉!`);
    else alert(`Переміг компʼютер :( Спробуйте зіграти ще раз!`);

    // Скидаємо рахунок для наступної гри
    score1 = 0;
    score2 = 0;
    score1Element.textContent = score1;
    score2Element.textContent = score2;

    // Знову вмикаємо кнопку старту
    startBtn.disabled = false;
    startBtn.textContent = "Почати знову";
  }, 10);
}

// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 4. МАЛЮВАННЯ ТА АНІМАЦІЯ
// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦

// Малюємо гру
function drawGame() {
  // Очищаємо полотно перед новим кадром анімації
  ctx.clearRect(0, 0, gameWidth, gameHeight);

  // Малюємо лінію по центру
  ctx.strokeStyle = "#f9f1e6";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(gameWidth / 2, 0);
  ctx.lineTo(gameWidth / 2, gameHeight);
  ctx.stroke();

  // Малюємо ракетки

  // Ракетка 1
  ctx.fillStyle = paddle1.color;
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

  // Ракетка 2
  ctx.fillStyle = paddle2.color;
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);

  // Малюємо м'яч
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

// Головний цикл гри
function update() {
  // 1. Рухаємо об'єкти
  movePaddles();
  moveBall();

  // 2. Перевіряємо правила
  checkWallBounces();
  checkPaddleBounces();
  checkScoring();

  // 3. Малюємо новий кадр
  drawGame();

  // 4. ПЕРЕВІРКА НА ПЕРЕМОГУ
  if (score1 === WINNING_SCORE || score2 === WINNING_SCORE) {
    gameOver();
    return; // Ця команда миттєво зупиняє функцію, тому цикл переривається!
  }

  // 5. Повторюємо (якщо гра не закінчилася)
  requestAnimationFrame(update);
}

// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 5. ЗАПУСК ГРИ
// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦

// Малюємо перший кадр, щоб екран не був порожнім
drawGame();

// Чекаємо на клік
startBtn.addEventListener("click", function() {
  // Показуємо правила гри у спливаючому вікні
  alert(
    "🏓 ПРАВИЛА ГРИ:\n\n" +
      "• Ви керуєте лівою ракеткою, компʼютер — правою.\n" +
      "• Клавіша 'W' рухає ракетку вгору, а 'S' — вниз.\n" +
      "• Перемагає той, хто перший набере 3 бали.\n" +
      "• М'яч прискорюється з кожним відбиванням!\n\n" +
      "Успіхів!",
  );

  startBtn.disabled = true; // Вимикаємо кнопку, щоб не натиснули двічі
  startBtn.textContent = "Приготуйтеся...";
  setTimeout(function() {
    startBtn.textContent = "Гра почалася!";
    update(); // Запускаємо головний цикл гри через 1.5 секунди
  }, 1500);
});
