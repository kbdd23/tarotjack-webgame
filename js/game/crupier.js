// --- CRUPIER: orquestación del turno y animaciones de resultado ---
//
// Responsabilidades:
// 1. Secuencia temporal del turno del crupier (revelar → jugar → resolver)
// 2. Animación específica para cada resultado (ganaste, perdiste, empate)
//
// No toca: lógica de juego (game.js), presentación (display.js), ni posicionamiento (layout.js)

import { state, cartasJugador } from '../core/state.js';
import { revelarCartaOculta, posicionarNuevasCrupier } from '../ui/layout.js';
import { actualizarPuntuacionCrupier, mostrarResultado } from '../ui/display.js';
import { turnoCrupier, determinarGanador, calcularPuntaje } from '../core/domain.js';

/**
 * Inicia el turno del crupier.
 *
 * Secuencia:
 *   FASE 1 — Revelar la carta oculta del crupier
 *   FASE 2 — El crupier juega (roba hasta 17)
 *   FASE 3 — Mostrar animación de resultado
 *
 * @returns {Promise<string>} Promesa que se resuelve con 'ganaste'|'perdiste'|'empate'
 */
export function iniciarTurno() {
  return new Promise((resolve) => {
    // FASE 1: animación de revelado
    revelarCartaOculta();

    // FASE 2: el crupier juega después de la animación de revelado
    setTimeout(() => {
      const result = turnoCrupier();

      posicionarNuevasCrupier();
      actualizarPuntuacionCrupier(false);

      // Calcular ganador
      const pj = calcularPuntaje(cartasJugador());
      const ganador = determinarGanador(pj, result.puntaje);

      state.resultado = ganador;
      state.fase = 'fin';
      
      setTimeout(() => {
        animarResultado(ganador);
        resolve(ganador);
      }, 600);
    }, 500);
  });
}

/**
 * Anima el resultado de la partida.
 *
 * Cada tipo (ganaste, perdiste, empate) tiene su propia animación.
 * Punto de extensión natural para: efectos visuales, sonido, partículas, etc.
 *
 * @param {'ganaste'|'perdiste'|'empate'} tipo
 */
export function animarResultado(tipo) {
  // Animación base compartida: mostrar texto con clase CSS
  mostrarResultado(tipo);

  // --- Punto de expansión ---
  // Aquí cada tipo puede tener su propia secuencia:
  //
  // switch (tipo) {
  //   case 'ganaste':
  //     // ej: partículas doradas, sonido de victoria, brillo en cartas del jugador
  //     break;
  //   case 'perdiste':
  //     // ej: screen shake, las cartas del crupier se iluminan, sonido de derrota
  //     break;
  //   case 'empate':
  //     // ej: pulso neutro, ambas manos se destacan sutilmente
  //     break;
  // }
}
