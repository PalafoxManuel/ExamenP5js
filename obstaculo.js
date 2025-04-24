// obstaculo.js
//
// Bloques del Breakout
//  • Los grises normales se rompen en 1 golpe.
//  • Los rojos (hits > 1) necesitan 3 impactos: se van aclarando al recibir daño.
//  • El bloque negro (unbreakable) nunca desaparece.

class Block {
  /**
   * @param {number} x     coordenada X
   * @param {number} y     coordenada Y
   * @param {number} w     ancho
   * @param {number} h     alto
   * @param {number} hits  golpes que resiste (Infinity = indestructible)
   * @param {boolean} unbreakable  true para el bloque negro
   */
  constructor(x, y, w, h, hits = 1, unbreakable = false) {
    this.x = x; this.y = y;
    this.w = w; this.h = h;
    this.hits = hits;
    this.unbreakable = unbreakable;
    this.colliding = false; // evita rebotar varias veces en el mismo frame
  }

  // Llamar cuando la bola le pega
  hit() {
    if (!this.unbreakable) this.hits--;
  }

  // ¿ya no le quedan golpes?
  isDead() {
    return this.hits <= 0;
  }

  // Dibujo con color según tipo / vida restante
  draw() {
    stroke(0);

    if (this.unbreakable) {
      fill(0);              // indestructible: negro
    } else if (this.hits > 1) {
      // bloque rojo que aguanta 3 golpes
      // a más daño, más claro
      const brillo = map(this.hits, 3, 1, 100, 255);
      fill(brillo, 0, 0);
    } else {
      fill(200);// bloque normal roto en 1 golpe
    }

    rect(this.x, this.y, this.w, this.h, 4);
  }
}