// logica.js

// Variables globales para manejar la pala, la bola, los bloques y niveles
let paddle, ball, blocks = [];
let level = 1;               // Nivel actual (1 al maxLevels)
const maxLevels = 3;         // Número de niveles totales
let ballReleased = false;    // Si la bola está libre o anclada a la pala

function setup() {
  // Configuración inicial del canvas y los objetos del juego
  createCanvas(800, 600);
  paddle = new Paddle();     // Creamos la pala
  ball   = new Ball();       // Creamos la bola
  initLevel(level);          // Preparamos el primer nivel
}

function draw() {
  background(30);            // Fondo oscuro para el juego

  // 1) Pintar y actualizar la pala
  paddle.update().draw();

  // 2) Mostrar siempre los bloques en pantalla
  for (let b of blocks) {
    b.draw();
  }

  // 3) Si la bola no ha sido lanzada, la colocamos encima de la pala
  if (!ballReleased) {
    ball.pos.x = paddle.x + paddle.w / 2;
    ball.pos.y = paddle.y - ball.r;
    ball.draw();
  }
  // 4) Bola en juego: mover, dibujar y chequear colisiones
  else {
    ball.update(paddle).draw();  // Mueve la bola y la pinta

    // Chequeo de colisiones AABB (una sola colisión por frame)
    for (let b of blocks) {
      const collide =
        ball.pos.x + ball.r > b.x &&
        ball.pos.x - ball.r < b.x + b.w &&
        ball.pos.y + ball.r > b.y &&
        ball.pos.y - ball.r < b.y + b.h;

      if (collide && !b.colliding) {
        // Primer contacto con este bloque
        b.colliding = true;
        b.hit();                // Reducir sus 'vidas'

        // Retrocedemos la bola a la posición anterior para un rebote limpio
        ball.pos = ball.prevPos.copy();

        // Calculamos cuánto se solapó en X y en Y para decidir rebote
        const overlapX =
          ball.pos.x < b.x + b.w / 2
            ? (ball.pos.x + ball.r) - b.x
            : (b.x + b.w) - (ball.pos.x - ball.r);
        const overlapY =
          ball.pos.y < b.y + b.h / 2
            ? (ball.pos.y + ball.r) - b.y
            : (b.y + b.h) - (ball.pos.y - ball.r);

        // Invertimos la velocidad según el eje con menor solapamiento
        if (overlapX < overlapY) {
          ball.vel.x *= -1;
        } else {
          ball.vel.y *= -1;
        }
        break;  // Salimos para procesar solo un rebote este frame
      } else if (!collide) {
        // Cuando la bola deja de tocar el bloque, reseteamos su flag
        b.colliding = false;
      }
    }

    // 5) Limpiamos los bloques destruidos
    blocks = blocks.filter(b => !b.isDead());

    // 6) Avanzar de nivel o finalizar si ya no hay bloques
    if (blocks.length === 0) {
      if (level < maxLevels) {
        level++;
        initLevel(level);
      } else {
        textAlign(CENTER);
        fill(255);
        textSize(32);
        text("¡Has completado todos los niveles!", width/2, height/2);
        noLoop();  // Detener el bucle de dibujo
      }
    }
  }
}

function keyPressed() {
  // Control de flechas para mover la pala
  paddle.handleKey(keyCode, true);
  // Barra espaciadora lanza la bola si aún no salió
  if (keyCode === 32 && !ballReleased) {
    ballReleased = true;
  }
}

function keyReleased() {
  paddle.handleKey(keyCode, false);
}

// ------------------------------------------------------------------
// Prepara un nivel: genera los bloques y resetea la bola
function initLevel(n) {
  blocks = [];
  ballReleased = false;  // De nuevo, bola pegada a la pala
  const cols = 10;
  const bw = width / cols;
  const bh = 20;
  let rows, speed;

  // Ajustes de filas y velocidad según el nivel
  switch (n) {
    case 1:
      rows = 4; speed = 5; break;
    case 2:
      rows = 5; speed = 6; break;
    case 3:
      rows = 6; speed = 7; break;
    default:
      rows = 4; speed = 5;
  }

  // Reiniciar la bola al centro y poner su velocidad inicial
  ball.reset();
  ball.vel.setMag(speed);

  // Crear bloques en cuadrícula
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let hits = 1;
      let unbreakable = false;
      let colRGB = [0, 200, 200];

      // Bloque especial de nivel 2
      if (n === 2 && i === 0 && j === 4) {
        hits = 3;
        colRGB = [255, 100, 100];
      }
      // Bloques especiales de nivel 3
      if (n === 3) {
        if (i === 1 && (j === 3 || j === 6)) {
          hits = 3;
          colRGB = [255, 100, 100];
        }
        if (i === 2 && j === 5) {
          hits = Infinity;
          unbreakable = true;
          colRGB = [80, 80, 80];
        }
      }

      blocks.push(
        new Block(
          j * bw,
          50 + i * bh,
          bw - 4,
          bh - 4,
          hits,
          unbreakable,
          colRGB
        )
      );
    }
  }
}
