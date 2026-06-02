// --- DISPLAY: puntuaciones, contador, resultado, recargas ---

import { state, cartasJugador, MAX_RONDAS } from '../core/state.js';
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

// --- RONDA ---

export function actualizarRondaDisplay() {
  if (refs.rondaDisplay) {
    refs.rondaDisplay.textContent = `${state.rondaActual}/${MAX_RONDAS}`;
  }
}

// --- PUNTOS POR RONDA ---

let _dibujarPuntos = null;

export function registrarDibujarPuntos(fn) {
  _dibujarPuntos = fn;
}

export function actualizarPuntosDisplay() {
  if (_dibujarPuntos) {
    _dibujarPuntos(state.historialRondas);
  }
}

// --- HP CRUPIER ---

let _setHp = null;

export function registrarSetHp(fn) {
  _setHp = fn;
}

export function actualizarHpDisplay(val) {
  const v = val !== undefined ? val : state.hpCrupierRestante;
  if (_setHp) _setHp(v);
}

// --- VIBRACIÓN CRUPIER ---

let _temblarCrupier = null;

export function registrarTemblarCrupier(fn) {
  _temblarCrupier = fn;
}

export function temblarCrupier() {
  if (_temblarCrupier) _temblarCrupier();
}

// --- ACTUALIZAR BOSS EN WIDGET ---

let _setBoss = null;

export function registrarSetBoss(fn) {
  _setBoss = fn;
}

export function actualizarBossDisplay(boss) {
  if (_setBoss) _setBoss(boss);
}
