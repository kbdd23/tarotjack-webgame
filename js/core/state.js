// --- ESTADO GLOBAL ---

export const state = {
  ordenActual: Array.from({ length: 60 }, (_, i) => i),
  cartasLibres: new Set(),
  cartasDescartadas: new Set(),
  slotsOcupados: [null, null],
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
};

export function inicializarEstado(baraja) {
  state.baraja = baraja;
  state.ordenActual = Array.from({ length: 60 }, (_, i) => i);
  state.cartasLibres.clear();
  state.cartasDescartadas.clear();
  state.slotsOcupados = [null, null];
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
}

export function hayCartasFuera() {
  return state.cartasLibres.size > 0 || state.desplegadoEnGrilla;
}

export function barajarMazo() {
  limpiarMano();
  for (let i = state.ordenActual.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.ordenActual[i], state.ordenActual[j]] = [state.ordenActual[j], state.ordenActual[i]];
  }
  state.barajeado = true;
}

export function ordenarMazo() {
  limpiarMano();
  state.ordenActual = Array.from({ length: 60 }, (_, i) => i);
  state.barajeado = false;
}

export function limpiarMano() {
  state.cartasLibres.clear();
  state.cartasDescartadas.clear();
  state.slotsOcupados = [null, null];
  state.manoCrupier = [];
  state.cartaOcultaIdx = null;
  state.fase = 'esperando';
  state.cartasExtra = [];
  state.resultado = null;
  state.maxCartasMano = 2;
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

/** Recolecta todas las cartas del jugador (slots + extra) */
export function cartasJugador() {
  const cartas = [];
  for (const idx of state.slotsOcupados) {
    if (idx !== null) cartas.push(state.baraja[idx]);
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
