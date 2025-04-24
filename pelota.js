// pelota.js
//
// Bola del Breakout:
//  • se mueve sola con una velocidad y ángulo inicial
//  • rebota en paredes, techo y pala
//  • avisa cuando se cae por la parte baja para que el juego le reste una vida

class Ball {
  constructor() {
    this.r = 12;          // radio
    this.offscreen = false;
    this.reset();        // posición y velocidad inicial
  }

  // Centra la bola y le da un ángulo aleatorio hacia abajo
  reset() {
    this.pos = createVector(width / 2, height / 2);
    const angle = random(-PI / 4, -3 * PI / 4);  // algo a la izquierda o derecha
    this.vel  = p5.Vector.fromAngle(angle).mult(5);
    this.offscreen = false;
  }

  // Mueve la bola y gestiona rebotes
  update(paddle) {
    this.prevPos = this.pos.copy();
    this.pos.add(this.vel);

    // Paredes laterales
    if (this.pos.x - this.r < 0 || this.pos.x + this.r > width) {
      this.vel.x *= -1;
    }
    // Techo
    if (this.pos.y - this.r < 0) {
      this.vel.y *= -1;
    }

    // ¿Se cayó?  → avisamos al juego con el flag offscreen
    if (this.pos.y - this.r > height) {
      this.offscreen = true;
      return this;
    }

    // Rebote con la pala
    const tocaPala =
      this.pos.y + this.r >= paddle.y &&
      this.pos.x > paddle.x &&
      this.pos.x < paddle.x + paddle.w;

    if (tocaPala) {
      this.vel.y *= -1; // rebote vertical
      // pequeño efecto: cambia el ángulo según dónde pega
      const diff = this.pos.x - (paddle.x + paddle.w / 2);
      this.vel.x = map(diff, -paddle.w / 2, paddle.w / 2, -5, 5);
    }

    return this;
  }

  // Dibuja la bola (verde brillante)
  draw() {
    noStroke();
    fill(90, 253, 28);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}
