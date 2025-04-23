// obstaculo.js

// Clase Block: representa cada bloque que la bola debe romper
class Block {
    /**
     * @param {number} x            Posición horizontal del bloque
     * @param {number} y            Posición vertical del bloque
     * @param {number} w            Ancho del bloque
     * @param {number} h            Alto del bloque
     * @param {number} hits         Cuántos golpes resiste antes de desaparecer
     *                               (Infinity para indestructible)
     * @param {boolean} unbreakable Si es true, nunca se destruye
     * @param {[number,number,number]} col  Color RGB opcional del bloque
     */
    constructor(x, y, w, h, hits = 1, unbreakable = false, col = [0, 200, 200]) {
      // Posición y tamaño
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      
      // Cuántos golpes aguanta y si es indestructible
      this.hits = hits;
      this.unbreakable = unbreakable;
      
      // Color personalizado (no siempre usado)
      this.col = col;
      
      // Para evitar procesar varias colisiones del mismo bloque en un solo frame
      this.colliding = false;
    }
  
    /**
     * Resta un golpe si el bloque no es indestructible
     */
    hit() {
      if (!this.unbreakable) {
        this.hits--;
      }
    }
  
    /**
     * Indica si el bloque ya no tiene "vidas" y debe eliminarse
     */
    isDead() {
      return this.hits <= 0;
    }
  
    /**
     * Dibuja el bloque, ajustando su brillo según cuántos golpes le quedan
     */
    draw() {
      stroke(0);
      // Si es indestructible, usar tono gris oscuro fijo
      // Si no, variar brillo de 255 (sin golpes) a 100 (varios golpes)
      const brillo = this.unbreakable
        ? 80
        : map(constrain(this.hits, 0, 3), 0, 3, 255, 100);
      fill(brillo, brillo, brillo);
      rect(this.x, this.y, this.w, this.h, 4);
    }
  }
  