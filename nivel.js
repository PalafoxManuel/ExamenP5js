// nivel.js

/**
 * Inicializa el nivel solicitado, ajustando cuántas filas de bloques hay,
 * la velocidad de la bola y definiendo bloques especiales (resistentes o indestructibles).
 * @param {number} n  El número de nivel (1, 2 o 3)
 */
function initLevel(n) {
    // Limpiamos la lista de bloques y preparamos la configuración
    blocks = [];
    const cols = 10;        // cuántas columnas de bloques vamos a tener
    const bw = width / cols; // ancho de cada bloque según el espacio disponible
    const bh = 20;          // altura fija para todos los bloques
  
    let rows;               // filas de bloques
    let speed;              // velocidad de la bola en este nivel
    const specials = [];    // aquí guardaremos los bloques que cambian la regla básica
  
    // Definimos parámetros según el nivel
    switch (n) {
      case 1:
        rows = 4;      // nivel sencillo: pocas filas
        speed = 5;     // velocidad inicial moderada
        break;
  
      case 2:
        rows = 5;      // nivel intermedio: un paso más de dificultad
        speed = 6;     // bola un poco más rápida
        // Un bloque que aguanta 3 impactos y se pinta de rojo
        specials.push({ row: 0, col: 4, hits: 3, colColor: [255, 0, 0] });
        break;
  
      case 3:
        rows = 6;      // nivel avanzado: más filas para romper
        speed = 7;     // velocidad alta
        // Dos bloques con 3 impactos y color rojo
        specials.push({ row: 1, col: 3, hits: 3, colColor: [255, 0, 0] });
        specials.push({ row: 1, col: 6, hits: 3, colColor: [255, 0, 0] });
        // Un bloque totalmente indestructible
        specials.push({
          row: 2,
          col: 5,
          hits: Infinity,
          unbreakable: true,
          colColor: [100, 100, 100]
        });
        break;
  
      default:
        console.warn("Nivel desconocido:", n);
        rows = 4;
        speed = 5; // valores por defecto si el nivel no es 1,2 o 3
    }
  
    // Ajustar la fuerza con la que se lanza la bola en este nivel
    ball.vel.setMag(speed);
  
    // Generamos todos los bloques en posición de rejilla
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // Miramos si este bloque tiene reglas especiales
        const spec = specials.find(s => s.row === i && s.col === j);
        const hits = spec ? spec.hits : 1;
        const unbreakable = spec && spec.unbreakable;
        const colRGB = spec ? spec.colColor : [0, 200, 200];
  
        // Creamos el bloque y lo añadimos a la lista
        blocks.push(new Block(
          j * bw,         // posición X
          50 + i * bh,    // posición Y con margen superior fijo
          bw - 4,         // ajustamos un pequeño espacio entre bloques
          bh - 4,
          hits,
          unbreakable,
          colRGB
        ));
      }
    }
  }
  