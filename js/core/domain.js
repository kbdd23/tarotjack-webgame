// --- LÓGICA DE JUEGO (blackjack, banca, apuestas) ---

import { state, sacarDelMazo } from './state.js';

// Puntaje de una mano según reglas de blackjack.
// Usa la propiedad `puntosBlackjack` de cada carta:
//   [n]      — valor fijo (2-10, figuras=10, arcanos 2-14)
//   [0, 11]  — Loco en tarot
//   [1, 11]  — As en blackjack
export function calcularPuntaje(cartas) {
  let suma = 0;
  let flexibles = 0;  // cartas con rango (A: [1,11] o Loco: [0,11])

  for (const c of cartas) {
    const pts = c.puntosBlackjack || [c.valor];
    if (pts.length > 1) {
      flexibles++;
      suma += pts[0];  // valor mínimo
    } else {
      suma += pts[0];
    }
  }

  // Optimizar: cambiar mínimo por máximo si no se quema
  for (let i = 0; i < flexibles; i++) {
    if (suma + 10 <= 21) suma += 10;
  }

  return suma;
}

export function estaQuemado(puntaje) {
  return puntaje > 21;
}

// --- TURNO DEL CRUPIER ---

export function turnoCrupier() {
  const cartas = [];
  for (const idx of state.manoCrupier) {
    cartas.push(state.baraja[idx]);
  }
  // Revelar la oculta
  if (state.cartaOcultaIdx !== null) {
    cartas.push(state.baraja[state.cartaOcultaIdx]);
  }

  let puntaje = calcularPuntaje(cartas);

  // El crupier pide hasta 17
  while (puntaje < 17) {
    const idx = sacarDelMazo();
    if (idx === null) break; // no hay más cartas
    state.manoCrupier.push(idx);
    cartas.push(state.baraja[idx]);
    puntaje = calcularPuntaje(cartas);
  }

  return { puntaje, quemado: estaQuemado(puntaje) };
}

// --- DETERMINAR GANADOR ---

export function determinarGanador(puntajeJugador, puntajeCrupier) {
  if (estaQuemado(puntajeJugador)) return 'perdiste';
  if (estaQuemado(puntajeCrupier)) return 'ganaste';
  if (puntajeJugador > puntajeCrupier) return 'ganaste';
  if (puntajeJugador < puntajeCrupier) return 'perdiste';
  return 'empate';
}
