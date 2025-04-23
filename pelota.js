// pelota.js

// Clase que representa la bola del juego, encargada de moverse y rebotar
class Ball {
    constructor() {
      // Radio de la bola
      this.r = 12;
      // Inicializa posición y velocidad
      this.reset();
    }
  
    /**
     * Lleva la bola al centro y le asigna un ángulo y velocidad iniciales
     */
    reset() {
      // Ponemos la bola justo en el medio de la pantalla
      this.pos = createVector(width / 2, height / 2);
      // Elegimos un ángulo hacia abajo, con algo de variación
      const angle = random(-PI / 4, -3 * PI / 4);
      // Generamos un vector de velocidad a partir de ese ángulo
      this.vel = p5.Vector.fromAngle(angle).mult(5);
    }
  
    /**
     * Actualiza la posición de la bola, maneja rebotes y reseteo
     * @param {Paddle} paddle  Instancia de la pala para detectar choques
     * @returns {Ball} la propia instancia para encadenar métodos
     */
    update(paddle) {
      // 1) Guardamos dónde estaba antes de movernos
      this.prevPos = this.pos.copy();
  
      // 2) Avanzamos la bola en base a su velocidad
      this.pos.add(this.vel);
  
      // 3) Rebote en los bordes: izquierda/derecha y techo
      if (this.pos.x - this.r < 0 || this.pos.x + this.r > width) {
        this.vel.x *= -1;
      }
      if (this.pos.y - this.r < 0) {
        this.vel.y *= -1;
      }
  
      // 4) Si la bola cae por debajo de la pantalla, la reiniciamos
      if (this.pos.y - this.r > height) {
        this.reset();
      }
  
      // 5) Choque con la pala: detectamos si toca la barra
      if (
        this.pos.y + this.r >= paddle.y &&
        this.pos.x > paddle.x &&
        this.pos.x < paddle.x + paddle.w
      ) {
        // Invertimos la velocidad vertical para rebotar
        this.vel.y *= -1;
        // Ajuste fino: variamos el ángulo según el punto de impacto
        const diff = this.pos.x - (paddle.x + paddle.w / 2);
        this.vel.x = map(diff, -paddle.w / 2, paddle.w / 2, -5, 5);
      }
  
      return this;
    }
  
    /**
     * Dibuja la bola en pantalla usando un círculo relleno
     */
    draw() {
      noStroke();
      fill(255, 150, 0);
      ellipse(this.pos.x, this.pos.y, this.r * 2);
    }
  }
  