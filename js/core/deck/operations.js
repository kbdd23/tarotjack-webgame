// --- OPERACIONES DE BARAJA (shuffle, sacar, reshuffle, ordenar) ---
//
// Extraídas de state.js para aislar la lógica de manipulación del mazo
// del estado global. Todas las funciones reciben el estado implícitamente
// a través del import de state.js (referencia viva, no snapshot).
//
// Dependencia cíclica controlada: state.js re-exporta desde aquí.
// ES modules resuelve el ciclo porque state es un objeto exportado
// como `const` y las funciones lo acceden en tiempo de ejecución.

import { state, limpiarMano } from '../state.js';

/** Baraja el mazo completo (Fisher-Yates).
 *  Limpia la mano actual y los descartes. */
export function barajarMazo() {
  limpiarMano();
  state.cartasDescartadas.clear();
  for (let i = state.ordenActual.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.ordenActual[i], state.ordenActual[j]] = [state.ordenActual[j], state.ordenActual[i]];
  }
  state.barajeado = true;
}

/** Restaura el orden original (0, 1, 2, ... N-1).
 *  Limpia la mano actual y los descartes. */
export function ordenarMazo() {
  limpiarMano();
  state.cartasDescartadas.clear();
  state.ordenActual = Array.from({ length: state.baraja.length }, (_, i) => i);
  state.barajeado = false;
}

/** Devuelve el índice de la siguiente carta disponible en el mazo.
 *  Recorre ordenActual de atrás hacia adelante (pop virtual).
 *  Omite cartas que ya están en juego (libres, descartadas, en mano, en slots, oculta, extra).
 *  @returns {number|null} índice de carta, o null si el mazo está agotado */
export function sacarDelMazo() {
  for (let i = state.ordenActual.length - 1; i >= 0; i--) {
    const idx = state.ordenActual[i];
    if (state.cartasLibres.has(idx)) continue;
    if (state.cartasDescartadas.has(idx)) continue;
    if (state.manoCrupier.includes(idx)) continue;
    if (state.slotsOcupados.includes(idx)) continue;
    if (idx === state.cartaOcultaIdx) continue;
    if (state.cartasExtra.includes(idx)) continue;
    state.cartasLibres.add(idx);
    return idx;
  }
  return null;
}

/** Recupera todas las cartas descartadas, baraja el mazo y marca reshuffle reciente.
 *  Debe llamarse cuando sacarDelMazo() devuelva null y haya cartas descartadas. */
export function hacerReshuffle() {
  state.reshuffleReciente = true;
  state.cartasDescartadas.clear();
  for (let i = state.ordenActual.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.ordenActual[i], state.ordenActual[j]] = [state.ordenActual[j], state.ordenActual[i]];
  }
  state.barajeado = true;
}
