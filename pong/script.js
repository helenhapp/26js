// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// ✨ 1. НАЛАШТУВАННЯ ✨
// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦

// 🔸 Полотно
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const gameWidth = canvas.width;
const gameHeight = canvas.height;

// 🔸 Рахунок гравців

// 1-й гравець:
const score1Element = document.querySelector("#s1");
let score1 = 0;

// 2-й гравець:
const score2Element = document.querySelector("#s2");
let score2 = 0;

// 🔸 Кнопка для запуску гри

// 🔸 Ракетка 1 (ліва)
const paddle1 = {
  x: 0,
  y: 0,
  width: 25,
  height: 95,
  speed: 9,
  color: "orangered",
};

// 🔸 Ракетка 2 (права)
const paddle2 = {
  x: gameWidth - 25,
  y: gameHeight - 95,
  width: 25,
  height: 95,
  speed: 5,
  color: "limegreen",
};

// 🔸 М'яч
const ball = {
  x: gameWidth / 2,
  y: gameHeight / 2,
  radius: 10,
  color: "darkblue",
  velocityX: 5,
  velocityY: 5,
  baseSpeed: 5, 
  maxSpeed: 7,
};

// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// ✨ 2. КЕРУВАННЯ ✨
// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦

// 🔸 Слідкуємо за тим, які клавіші натиснуті
// Створюємо "перемикачі" для клавіш (спочатку вони не натиснуті)
const keys = {
  KeyW: false,
  KeyS: false,
};

// Коли клавіша НАТИСНУТА, вмикаємо перемикач (true)
window.addEventListener("keydown", (event) => {
  if (event.code in keys) keys[event.code] = true;
});

// Коли клавіша ВІДПУЩЕНА, вимикаємо перемикач (false)
window.addEventListener("keyup", (event) => {
  if (event.code in keys) keys[event.code] = false;
});

// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// ✨ 3. ЛОГІКА ГРИ ✨
// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦

// 🔸 Функція movePaddles: Рухаємо ракетки, але не даємо їм вийти за межі полотна
function movePaddles() {
  // --- ЛЮДИНА (Ракетка 1) ---

  // 1. Перевіряємо, чи є куди рухатися
  const p1CanMoveUp = paddle1.y > 0;
  const p1CanMoveDown = paddle1.y < gameHeight - paddle1.height;

  // 2. Якщо клавіша натиснута ТА є місце -> рухаємо ракетку
  if (keys.KeyW && p1CanMoveUp) paddle1.y -= paddle1.speed;
  if (keys.KeyS && p1CanMoveDown) paddle1.y += paddle1.speed;

  // --- КОМП'ЮТЕР (Ракетка 2) ---
  // 1. Перевіряємо, чи є місце для руху
  const p2CanMoveUp = paddle2.y > 0;
  const p2CanMoveDown = paddle2.y < gameHeight - paddle2.height;

  // 2. Шукаємо центр ракетки комп'ютера
  const p2Center = paddle2.y + paddle2.height / 2;

  // Щоб дії бота не були ідеально точні
  const botSeesBall = ball.x > gameWidth / 2;

  if (botSeesBall) {
    // 3. Рухаємо ракетку за м'ячем
    if (ball.y < p2Center && p2CanMoveUp) paddle2.y -= paddle2.speed;
    else if (ball.y > p2Center && p2CanMoveDown) paddle2.y += paddle2.speed; // 🔹 допишіть код для руху вниз 🔹
  }
}

// 🔸 Функція moveBall: Рухаємо мʼяч
function moveBall() {
  // Зміна координат
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
}

// 🔸 Функція checkWallBounces: Відбивання від стелі та підлоги
function checkWallBounces() {
  const hitTop = ball.y - ball.radius < 0; // Чи торкнувся стелі
  const hitBottom = ball.y + ball.radius > gameHeight; // 🔹 чи координата y + радіус більша за gameHeight?

  // Якщо торкнувся стелі АБО підлоги
  if (hitTop || hitBottom) {
    ball.velocityY *= -1; // розвертаємо м'яч
  }
}

// 🔸 Функція checkCollision: Перевірємо зіткнення мʼяча та ракетки
function checkCollision(ball, paddle) {
  // 1. Визначаємо краї м'яча
  const ballTop = ball.y - ball.radius; // верхній край
  const ballLeft = ball.x - ball.radius; // лівий край
  const ballBottom = ball.y + ball.radius; // 🔹 нижній
  const ballRight = ball.x + ball.radius; // 🔹 правий

  // 2. Визначаємо краї ракетки
  const paddleTop = paddle.y; // верх
  const paddleLeft = paddle.x; // ліво
  const paddleBottom = paddle.y + paddle.height; // 🔹 низ
  const paddleRight = paddle.x + paddle.width; // 🔹 право

  // 3. Перевіряємо, чи перетинаються вони по X та Y
  const overlapX = ballRight >= paddleLeft && ballLeft <= paddleRight;
  const overlapY = ballBottom >= paddleTop && ballTop <= paddleBottom;

  // 4. Повертаємо результат
  // true — якщо є зіткнення, false — якщо немає
  return overlapX && overlapY;
}

// 🔸 Функція checkPaddleBounces: Відбивання від ракеток
function checkPaddleBounces() {
  // 1. Визначаємо, на чиїй половині поля зараз м'яч
  const isLeftHalf = ball.x < gameWidth / 2;

  // 2. Вибираємо ракетку для перевірки (ліву чи праву)
  const activePaddle = isLeftHalf ? paddle1 : paddle2;

  // 3. Перевіряємо, чи торкнувся м'яч цієї ракетки
  const isCollision = checkCollision(ball, activePaddle);

  const a = 0.2;

  // 4. Якщо торкнувся — відбиваємо!
  if (isCollision) {
    // ПРИСКОРЕННЯ (якщо ще не досягли ліміту)
    if (Math.abs(ball.velocityX) < ball.maxSpeed) {
      // по осі x
      if (ball.velocityX > 0) ball.velocityX += a;
      else ball.velocityX -= a;

      // по осі y
      // 🔹 напишіть самостійно логіку прискорення для осі Y 🔹
      if (ball.velocityY > 0) ball.velocityY += a;
      else ball.velocityY -= a;
    }

    if (isLeftHalf) {
      // Відбиваємо ВПРАВО (робимо швидкість додатною)
      ball.velocityX = Math.abs(ball.velocityX);
      // "Виштовхуємо" м'яч, щоб він не застряг у текстурі ракетки
      ball.x = activePaddle.x + activePaddle.width + ball.radius;
    } else {
      // Відбиваємо ВЛІВО (робимо швидкість відʼємною)
      ball.velocityX = -Math.abs(ball.velocityX);
      // "Виштовхуємо" м'яч з правої ракетки
      ball.x = activePaddle.x - ball.radius;
    }
  }
}

// 🔸 Функція checkScoring: Якщо м'яч вилетів за екран — це гол
function checkScoring() {
  const pastLeftWall = ball.x + ball.radius < 0; // чи мʼяч перетнув лівий край полотна
  const pastRightWall = ball.x - ball.radius > gameWidth; // чи мʼяч перетнув правий край полотна

  // 🔹 допишіть умову всередині if 🔹
  if (pastLeftWall || pastRightWall) {
    // Оновлюємо рахунок у пам'яті комп'ютера
    const isLeftHalf = ball.x < gameWidth / 2;
    isLeftHalf ? score2++ : score1++;

    // Оновлюємо текст на екрані
    score1Element.textContent = score1; // рахунок 1-го гравця
    // 🔹 допишіть код для 2-го гравця 🔹
    score2Element.textContent = score2;

    // Повертаємо м'яч
    // 🔹 викличте функцію resetBall 🔹
    resetBall();
  }
}

// 🔸 Функція resetBall: Повертаємо м'яч у центр полотна та скидаємо швидкість
function resetBall() {
  ball.x = gameWidth / 2; // 🔹 половина ширини полотна
  ball.y = gameHeight / 2; // 🔹 половина висоти полотна

  // Скидаємо швидкість по X і віддаємо м'яч тому, хто пропустив
  if (ball.velocityX > 0) ball.velocityX = -ball.baseSpeed;
  else ball.velocityX = ball.baseSpeed;

  // Скидаємо швидкість по Y, зберігаючи напрямок
  if (ball.velocityY > 0) ball.velocityY = ball.baseSpeed;
  else ball.velocityY = -ball.baseSpeed;
}

// 🔸 Функція gameOver: Завершення гри

// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// ✨ 4. МАЛЮВАННЯ ТА АНІМАЦІЯ ✨
// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦

// 🔸 Функція drawGame: Малюємо гру
function drawGame() {
  // 1. Очищаємо полотно перед малюванням нового кадру
  ctx.clearRect(0, 0, gameWidth, gameHeight);

  // 2. Малюємо білу лінію по центру
  ctx.strokeStyle = "#f9f1e6";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(gameWidth / 2, 0);
  ctx.lineTo(gameWidth / 2, gameHeight);
  ctx.stroke();

  // 3. Малюємо ліву ракетку
  ctx.fillStyle = paddle1.color;
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

  // 4. Малюємо праву ракетку
  ctx.fillStyle = paddle2.color;
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);

  // 5. Малюємо м'яч
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

// 🔸 Функція update: Головний цикл гри
function update() {
  // Рухаємо об'єкти
  movePaddles();
  moveBall();
  checkWallBounces();
  checkPaddleBounces();
  checkScoring();

  // Малюємо новий кадр
  drawGame();

  // 3. Повторюємо цикл нескінченно
  requestAnimationFrame(update);
}

update();

// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// ✨ 5. ЗАПУСК ГРИ ✨
// - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦

// 🔸 Малюємо перший кадр, щоб екран не був порожнім
drawGame();

// 🔸 Чекаємо на клік (addEventListener("click", ...))
