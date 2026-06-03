// --- ESTADO GLOBAL ---
//
// Responsabilidad: cápsula del estado del juego + funciones de mutación
// que no son operaciones de baraja (extraídas a deck-ops.js).
//
// Las operaciones de baraja se re-exportan desde deck-ops.js para
// mantener compatibilidad con los imports existentes.

// Re-export de operaciones de baraja (extraídas por modularización)
export { barajarMazo, ordenarMazo, sacarDelMazo, hacerReshuffle } from './deck/operations.js';

export const MAX_RONDAS = 5;

export const BOSSES = [
  { nombre: 'Chile',    archivo: 'chilean_crupier-removebg-preview.png',    hp: 3 },
  { nombre: 'Argentina', archivo: 'argentina_crupier-removebg-preview.png', hp: 4 },
  { nombre: 'Brasil',    archivo: 'brasil_crupier-removebg-preview.png',    hp: 5 },
  { nombre: 'España',    archivo: 'spain_crupier-removebg-preview.png',    hp: 7 },
  { nombre: 'Diablo',    archivo: 'devil_crupier-removebg-preview.png',    hp: 10 },
];

export const state = {
  ordenActual: Array.from({ length: 60 }, (_, i) => i),
  cartasLibres: new Set(),
  cartasDescartadas: new Set(),
  slotsOcupados: [null, null, null, null, null],
  desplegadoEnGrilla: false,
  barajeado: false,
  ultimoLayout: null,
  baraja: null,
  recargasRestantes: 3,
  // --- CRUPIER ---
  manoCrupier: [],
  cartaOcultaIdx: null,
  cartaOcultaRevelada: false, // true cuando revelarCartaOculta fue llamada en juego
  // --- FLUJO ---
  fase: 'esperando', // 'esperando' | 'jugando' | 'crupier' | 'fin'
  cartasExtra: [],   // índices de cartas pedidas por el jugador
  resultado: null,   // 'ganaste' | 'perdiste' | 'empate'
  maxCartasMano: 2,  // máximo de cartas que puede tener el jugador en mano
  rondaActual: 0,    // contador de rondas (win streak)
  historialRondas: [], // 'ganaste' | 'perdiste' | 'empate'
  bossActual: 0,
  hpCrupierRestante: 3,
  tipoMazo: 'tarot', // 'tarot' | 'blackjack'
  reshuffleReciente: false, // true cuando sacarDelMazo hizo reshuffle
  cartasReveladas: false,   // dev-tool: true = mostrar todas boca arriba
};

export function inicializarEstado(baraja, tipo) {
  state.baraja = baraja;
  state.tipoMazo = tipo || 'tarot';
  state.ordenActual = Array.from({ length: baraja.length }, (_, i) => i);
  state.cartasLibres.clear();
  state.cartasDescartadas.clear();
  state.slotsOcupados = [null, null, null, null, null];
  state.desplegadoEnGrilla = false;
  state.barajeado = false;
  state.ultimoLayout = null;
  state.recargasRestantes = 3;
  state.manoCrupier = [];
  state.cartaOcultaIdx = null;
  state.cartaOcultaRevelada = false;
  state.fase = 'esperando';
  state.cartasExtra = [];
  state.resultado = null;
  state.maxCartasMano = 2;
  state.rondaActual = 0;
  state.historialRondas = [];
  state.bossActual = 0;
  state.hpCrupierRestante = BOSSES[0].hp;
  state.reshuffleReciente = false;
  state.cartasReveladas = false;
}

export function hayCartasFuera() {
  return state.cartasLibres.size > 0 || state.desplegadoEnGrilla;
}

export function limpiarMano() {
  state.cartasLibres.clear();
  state.slotsOcupados = [null, null, null, null, null];
  state.manoCrupier = [];
  state.cartaOcultaIdx = null;
  state.cartaOcultaRevelada = false;
  state.fase = 'esperando';
  state.cartasExtra = [];
  state.resultado = null;
  state.recargasRestantes = 3;
  state.desplegadoEnGrilla = false;
}

/** Mueve las cartas de la ronda actual al descarte y resetea el estado para la próxima mano.
 *  NO baraja ni devuelve descartes al mazo — el mazo se reduce progresivamente.
 *  Para reinicio completo usar barajarMazo(). */
export function finalizarRonda() {
  // Mover slots del jugador a descarte
  for (let s = 0; s < state.maxCartasMano; s++) {
    if (state.slotsOcupados[s] !== null) {
      state.cartasDescartadas.add(state.slotsOcupados[s]);
      state.slotsOcupados[s] = null;
    }
  }
  // Mover mano del crupier a descarte
  for (const idx of state.manoCrupier) {
    state.cartasDescartadas.add(idx);
  }
  state.manoCrupier = [];
  // Mover carta oculta a descarte
  if (state.cartaOcultaIdx !== null) {
    state.cartasDescartadas.add(state.cartaOcultaIdx);
    state.cartaOcultaIdx = null;
    state.cartaOcultaRevelada = false;
  }
  // Mover cartas extra a descarte
  for (const idx of state.cartasExtra) {
    state.cartasDescartadas.add(idx);
  }
  state.cartasExtra = [];
  // Resetear estado
  state.cartasLibres.clear();
  state.fase = 'esperando';
  state.resultado = null;
  state.recargasRestantes = 3;
  state.desplegadoEnGrilla = false;
}

export function liberarCarta(idx) {
  state.cartasLibres.add(idx);
}

export function apilarTodo() {
  limpiarMano();
}

export function slotOcupado(slotIdx, cartaIdx) {
  state.slotsOcupados[slotIdx] = cartaIdx;
  state.cartasLibres.add(cartaIdx);
  state.cartasDescartadas.delete(cartaIdx);
}

export function slotLibre(slotIdx) {
  state.slotsOcupados[slotIdx] = null;
}

export function descartarSlot(slotIdx) {
  const idx = state.slotsOcupados[slotIdx];
  if (idx === null) return null;
  state.slotsOcupados[slotIdx] = null;
  state.cartasDescartadas.add(idx);
  return idx;
}

/** Recolecta todas las cartas del jugador (slots activos + extra) */
export function cartasJugador() {
  const cartas = [];
  for (let s = 0; s < state.maxCartasMano; s++) {
    if (state.slotsOcupados[s] !== null) cartas.push(state.baraja[state.slotsOcupados[s]]);
  }
  for (const idx of state.cartasExtra) {
    cartas.push(state.baraja[idx]);
  }
  return cartas;
}

/** Recolecta todas las cartas del crupier (mano + oculta) */
export function cartasCrupier() {
  const cartas = [];
  for (const idx of state.manoCrupier) {
    cartas.push(state.baraja[idx]);
  }
  if (state.cartaOcultaIdx !== null) {
    cartas.push(state.baraja[state.cartaOcultaIdx]);
  }
  return cartas;
}
