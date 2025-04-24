// logica.js
// ─────────────────────────────────────────────────────────────
// Controla el juego Breakout: niveles, vidas, puntos y colisiones
// ─────────────────────────────────────────────────────────────

// Objetos principales
let paddle, ball, blocks = [];

// Estado del juego
let level            = 1;
const maxLevels      = 3;
let lives            = 3;
let score            = 0;
let ballReleased     = false; // la bola ya está en juego
let showLevelMessage = true;  // cartel de “presiona ESPACIO…”
let gameOver         = false; // fin de partida (ganar o perder)
let victory          = false; // true si ganaste

function setup() {
  createCanvas(800, 600);
  paddle = new Paddle();
  ball   = new Ball();
  initLevel(level);      // arma los bloques del primer nivel
}

function draw() {
  background(30);

  // Pala y bloques
  paddle.update().draw();
  blocks.forEach(b => b.draw());

  // Marcas de vidas, puntos y nivel
  fill(255);
  textSize(16);
  textAlign(LEFT);
  text(`Vidas: ${lives}`, 20, 20);
  text(`Puntaje: ${score}`, 20, 40);
  textAlign(RIGHT);
  text(`Nivel: ${level}`, width - 20, 20);

  // ¿Ya no quedan bloques que se puedan romper?
  const destructibles = blocks.filter(b => !b.unbreakable);
  if (!gameOver && destructibles.length === 0) {
    victory  = true;
    gameOver = true;
    noLoop();
  }

  // Pantalla final (ganar o perder)
  if (gameOver) {
    textAlign(CENTER);
    textSize(32);
    fill(255, 0, 0);
    text(
      victory ? "¡Victoria!" : "Game Over",
      width / 2, height / 2 - 20
    );
    textSize(20);
    fill(255);
    text("ENTER para reiniciar", width / 2, height / 2 + 20);
    return;
  }

  // Cartel al empezar nivel o tras perder vida
  if (showLevelMessage) {
    pegarBolaALaPala();
    textAlign(CENTER);
    textSize(24);
    fill(200);
    text(`Nivel ${level} – ESPACIO para empezar`, width / 2, height / 2);
    return;
  }

  // Bola pegada antes del primer lanzamiento
  if (!ballReleased) {
    pegarBolaALaPala();
    return;
  }

  // Bola en juego
  ball.update(paddle).draw();

  // Si la bola se cayó
  if (ball.offscreen) {
    ball.offscreen = false;
    lives--;
    if (lives > 0) {
      ballReleased     = false;
      showLevelMessage = true;
      ball.reset();
    } else {
      gameOver = true;
    }
    return;
  }

  // Colisión con bloques
  detectarColisionesConBloques();

  // Eliminar bloques rotos
  blocks = blocks.filter(b => !b.isDead());
}

function keyPressed() {
  paddle.handleKey(keyCode, true);

  // ENTER para reiniciar
  if (gameOver && (keyCode === ENTER || key === 'Enter')) {
    reiniciarJuego();
    return;
  }

  // ESPACIO para lanzar la bola
  if (keyCode === 32 && showLevelMessage) {
    showLevelMessage = false;
    ballReleased     = true;
  }
}

function keyReleased() {
  paddle.handleKey(keyCode, false);
}

// ─── FUNCIONES AUXILIARES ────────────────────────────────────
function pegarBolaALaPala() {
  ball.pos.set(paddle.x + paddle.w / 2, paddle.y - ball.r);
  ball.draw();
}

function reiniciarJuego() {
  lives            = 3;
  score            = 0;
  level            = 1;
  gameOver         = false;
  victory          = false;
  ballReleased     = false;
  showLevelMessage = true;
  loop();
  initLevel(level);
}

function detectarColisionesConBloques() {
  for (let b of blocks) {
    const choca =
      ball.pos.x + ball.r > b.x &&
      ball.pos.x - ball.r < b.x + b.w &&
      ball.pos.y + ball.r > b.y &&
      ball.pos.y - ball.r < b.y + b.h;

    if (choca && !b.colliding) {
      b.colliding = true;
      b.hit();
      if (b.isDead() && !b.unbreakable) score++;

      // Rebote: vuelve atrás y refleja velocidad
      ball.pos = ball.prevPos.copy();
      const dx = (ball.pos.x < b.x + b.w / 2)
        ? (ball.pos.x + ball.r) - b.x
        : (b.x + b.w) - (ball.pos.x - ball.r);
      const dy = (ball.pos.y < b.y + b.h / 2)
        ? (ball.pos.y + ball.r) - b.y
        : (b.y + b.h) - (ball.pos.y - ball.r);
      if (dx < dy) ball.vel.x *= -1; else ball.vel.y *= -1;
      break; // solo una colisión por fotograma
    } else if (!choca) {
      b.colliding = false;
    }
  }
}

function initLevel(n) {
  blocks           = [];
  ballReleased     = false;
  showLevelMessage = true;

  const cols = 10, bw = width / cols, bh = 20;
  let rows, speed;

  if (n === 1) { rows = 4; speed = 5; }
  if (n === 2) { rows = 5; speed = 6; }
  if (n === 3) { rows = 6; speed = 7; }

  ball.reset();
  ball.vel.setMag(speed);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let hits = 1, unbreakable = false;
      if (n === 2 && i === 0 && j === 4) hits = 3;
      if (n === 3) {
        if (i === 1 && (j === 3 || j === 6)) hits = 3;
        if (i === 2 && j === 5) { hits = Infinity; unbreakable = true; }
      }
      blocks.push(new Block(
        j * bw, 50 + i * bh, bw - 4, bh - 4, hits, unbreakable
      ));
    }
  }
}
