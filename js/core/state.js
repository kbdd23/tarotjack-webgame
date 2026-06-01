// --- ESTADO GLOBAL ---

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
  // --- FLUJO ---
  fase: 'esperando', // 'esperando' | 'jugando' | 'crupier' | 'fin'
  cartasExtra: [],   // índices de cartas pedidas por el jugador
  resultado: null,   // 'ganaste' | 'perdiste' | 'empate'
  maxCartasMano: 2,  // máximo de cartas que puede tener el jugador en mano
  rondaActual: 0,    // contador de rondas (win streak)
  tipoMazo: 'tarot', // 'tarot' | 'blackjack'
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
  state.fase = 'esperando';
  state.cartasExtra = [];
  state.resultado = null;
  state.maxCartasMano = 2;
  state.rondaActual = 0;
}

export function hayCartasFuera() {
  return state.cartasLibres.size > 0 || state.desplegadoEnGrilla;
}

export function barajarMazo() {
  limpiarMano();
  state.cartasDescartadas.clear();
  for (let i = state.ordenActual.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.ordenActual[i], state.ordenActual[j]] = [state.ordenActual[j], state.ordenActual[i]];
  }
  state.barajeado = true;
}

export function ordenarMazo() {
  limpiarMano();
  state.cartasDescartadas.clear();
  state.ordenActual = Array.from({ length: state.baraja.length }, (_, i) => i);
  state.barajeado = false;
}

export function limpiarMano() {
  state.cartasLibres.clear();
  state.slotsOcupados = [null, null, null, null, null];
  state.manoCrupier = [];
  state.cartaOcultaIdx = null;
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

/** Devuelve el índice de la siguiente carta disponible del mazo, o null si no queda */
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
