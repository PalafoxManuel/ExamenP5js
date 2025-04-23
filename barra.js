// barra.js

// Clase que representa la pala del jugador, la cual se mueve horizontalmente
class Paddle {
    constructor() {
      // Dimensiones de la pala
      this.w = 120;
      this.h = 20;
      // Posición inicial: centrada en X y a 40px del borde inferior
      this.x = width / 2 - this.w / 2;
      this.y = height - 40;
      // Velocidad de desplazamiento y dirección (0 = quieto)
      this.speed = 8;
      this.dir = 0;
    }
  
    /**
     * Maneja la entrada del teclado para mover la pala
     * @param {number} code    Código de tecla (LEFT_ARROW o RIGHT_ARROW)
     * @param {boolean} pressed  true al presionar, false al soltar
     */
    handleKey(code, pressed) {
      if (code === LEFT_ARROW)  this.dir = pressed ? -1 : 0;
      if (code === RIGHT_ARROW) this.dir = pressed ? +1 : 0;
    }
  
    /**
     * Actualiza la posición de la pala según la dirección y velocidad,
     * asegurándose de que no salga del área de juego.
     * @returns {Paddle} la propia instancia para encadenar métodos
     */
    update() {
      this.x = constrain(this.x + this.dir * this.speed, 0, width - this.w);
      return this;
    }
  
    /**
     * Dibuja la pala en la posición actual con un leve redondeo de esquinas.
     */
    draw() {
      fill(200);
      rect(this.x, this.y, this.w, this.h, 5);
    }
  }
  