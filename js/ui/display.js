// --- DISPLAY: puntuaciones, contador, resultado, recargas ---

import { state, cartasJugador } from '../core/state.js';
import { calcularPuntaje } from '../core/domain.js';
import { refs } from './dom.js';

// --- PUNTUACIONES ---

export function actualizarPuntuacion() {
  const cartas = cartasJugador();
  const suma = calcularPuntaje(cartas);

  if (refs.puntuacionDisplay) {
    refs.puntuacionDisplay.textContent = `${suma} / 21`;
    refs.puntuacionDisplay.className = suma > 21 ? 'quemado' : '';
  }
}

export function actualizarPuntuacionCrupier(ocultar = true) {
  if (!refs.puntuacionCrupier) return;

  if (ocultar && state.cartaOcultaIdx !== null) {
    const cartas = state.manoCrupier.map(idx => state.baraja[idx]);
    const suma = calcularPuntaje(cartas);
    refs.puntuacionCrupier.textContent = `${suma} + ?`;
  } else {
    const todas = [...state.manoCrupier];
    if (state.cartaOcultaIdx !== null) todas.push(state.cartaOcultaIdx);
    const cartas = todas.map(idx => state.baraja[idx]);
    const suma = calcularPuntaje(cartas);
    refs.puntuacionCrupier.textContent = `${suma}`;
    refs.puntuacionCrupier.className = suma > 21 ? 'punt-crupier quemado' : 'punt-crupier';
  }
}

// --- RECARGAS ---

export function actualizarRecargas() {
  if (refs.recargasDisplay) {
    refs.recargasDisplay.textContent = String(state.recargasRestantes);
  }
  if (refs.descarteDisplay) {
    refs.descarteDisplay.textContent = `${state.recargasRestantes}/3`;
  }
}

// --- RESULTADO ---

export function mostrarResultado(resultado) {
  if (!refs.resultadoDisplay) return;
  const msgs = { ganaste: 'GANASTE', perdiste: 'PERDISTE', empate: 'EMPATE' };
  refs.resultadoDisplay.textContent = msgs[resultado] || '';
  refs.resultadoDisplay.className = resultado || '';
  refs.resultadoDisplay.style.display = 'block';

  // Esconder puntuacion del crupier al mostrar resultado
  if (refs.puntuacionCrupier) {
    refs.puntuacionCrupier.style.display = 'none';
  }
}

export function ocultarResultado() {
  if (refs.resultadoDisplay) {
    refs.resultadoDisplay.style.display = 'none';
  }
  if (refs.puntuacionCrupier) {
    refs.puntuacionCrupier.style.display = '';
  }
}

// --- TOGGLES ---

export function mostrarPlaceholders(visible) {
  if (refs.zonaMano) {
    refs.zonaMano.style.display = visible ? '' : 'none';
  }
}

export function mostrarDescarte(visible) {
  if (refs.zonaDescarte) {
    refs.zonaDescarte.style.display = visible ? '' : 'none';
  }
}
