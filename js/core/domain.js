// --- LÓGICA DE JUEGO (blackjack, banca, apuestas) ---

import { state, sacarDelMazo } from './state.js';

// Puntaje de una mano según reglas de blackjack
export function calcularPuntaje(cartas) {
  let suma = 0;
  let locos = 0;

  for (const c of cartas) {
    if (c.valor === 0) {
      locos++;
    } else {
      suma += c.valor;
    }
  }

  // Asignar valor óptimo a los Locos (0 o 11)
  for (let i = 0; i < locos; i++) {
    if (suma + 11 <= 21) {
      suma += 11;
    } else {
      suma += 0;
    }
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
