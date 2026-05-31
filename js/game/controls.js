// --- CONTROLS: handlers del juego (repartir, pedir, jugar, nueva mano, descartar) ---
//
// Responsabilidad: conectar eventos del usuario con la lógica del juego.
// El estado visual de los botones se delega en `panel`.

import {
  state,
  sacarDelMazo, limpiarMano,
} from '../core/state.js';
import { refs } from '../ui/dom.js';
import {
  posicionarApilado, posicionarCrupier, posicionarExtra,
  animarADescarte, escalarASlot,
} from '../ui/layout.js';
import {
  actualizarPuntuacion, actualizarPuntuacionCrupier,
  actualizarRecargas, ocultarResultado,
} from '../ui/display.js';
import { calcularPuntaje } from '../core/domain.js';
import { iniciarTurno } from './crupier.js';

export function setup(panel, btnRepartir, btnPedir, btnJugar, btnNuevaMano, btnDescartar) {

  // --- REPARTIR ---

  btnRepartir.addEventListener('click', () => {
    if (state.fase === 'jugando') return;

    limpiarMano();
    ocultarResultado();

    let slotCount = 0;
    for (let r = 0; r < 2; r++) {
      let slotLibre = -1;
      for (let s = 0; s < state.slotsOcupados.length; s++) {
        if (state.slotsOcupados[s] === null) { slotLibre = s; break; }
      }
      if (slotLibre === -1) break;

      const cartaIdx = sacarDelMazo();
      if (cartaIdx === null) break;

      state.slotsOcupados[slotLibre] = cartaIdx;
      escalarASlot(refs.cartasDOM[cartaIdx], slotLibre);
      slotCount++;
    }

    if (slotCount < 2) return;

    const cartaCrupier1 = sacarDelMazo();
    const cartaCrupier2 = sacarDelMazo();
    if (cartaCrupier1 === null || cartaCrupier2 === null) {
      limpiarMano();
      return;
    }

    state.manoCrupier = [cartaCrupier1];
    state.cartaOcultaIdx = cartaCrupier2;

    setTimeout(() => { posicionarCrupier(); }, 300);

    state.fase = 'jugando';
    btnRepartir.style.display = 'none';
    panel.actualizarContador(slotCount, state.maxCartasMano);
    actualizarPuntuacion();
    panel.mostrarJuego();
  });

  // --- PEDIR (hit) ---

  btnPedir.addEventListener('click', () => {
    if (state.fase !== 'jugando') return;

    let countAct = 0;
    for (const idx of state.slotsOcupados) {
      if (idx !== null) countAct++;
    }
    countAct += state.cartasExtra.length;
    if (countAct >= state.maxCartasMano) {
      btnPedir.disabled = true;
      return;
    }

    const cartaIdx = sacarDelMazo();
    if (cartaIdx === null) return;

    const div = refs.cartasDOM[cartaIdx];

    let slotLibre = -1;
    for (let s = 0; s < state.slotsOcupados.length; s++) {
      if (state.slotsOcupados[s] === null) { slotLibre = s; break; }
    }

    if (slotLibre !== -1) {
      state.slotsOcupados[slotLibre] = cartaIdx;
      escalarASlot(div, slotLibre);
    } else {
      state.cartasExtra.push(cartaIdx);
      div.style.transition = 'none';
      div.getBoundingClientRect();
      div.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      div.style.width = '80px';
      div.style.height = '110px';
      div.classList.remove('carta-oculta');
      posicionarExtra();
    }

    actualizarPuntuacion();

    // Calcular conteo actual para el contador y el límite de cartas
    let nuevoCount = 0;
    for (const idx of state.slotsOcupados) {
      if (idx !== null) nuevoCount++;
    }
    nuevoCount += state.cartasExtra.length;
    panel.actualizarContador(nuevoCount, state.maxCartasMano);

    if (nuevoCount >= state.maxCartasMano) {
      btnPedir.disabled = true;
    }

    const cartasJug = [];
    for (const idx of state.slotsOcupados) {
      if (idx !== null) cartasJug.push(state.baraja[idx]);
    }
    for (const idx of state.cartasExtra) {
      cartasJug.push(state.baraja[idx]);
    }
    const pj = calcularPuntaje(cartasJug);
    if (pj > 21) {
      state.fase = 'crupier';
      ejecutarTurnoCrupier();
    }
  });

  // --- JUGAR (plantarse) ---

  btnJugar.addEventListener('click', () => {
    if (state.fase !== 'jugando') return;

    state.fase = 'crupier';
    ejecutarTurnoCrupier();
  });

  function ejecutarTurnoCrupier() {
    btnPedir.disabled = true;
    btnJugar.disabled = true;

    iniciarTurno().then(() => {
      panel.mostrarNuevaMano();

      btnPedir.disabled = false;
      btnJugar.disabled = false;
    });
  }

  // --- NUEVA MANO ---

  btnNuevaMano.addEventListener('click', () => {
    limpiarMano();

    refs.btnDescartar.disabled = false;
    refs.recargasDisplay.classList.remove('agotado');

    refs.cartasDOM.forEach(div => {
      div.classList.remove('carta-oculta', 'carta-jugador', 'carta-crupier');
      div.style.transition = '';
    });
    posicionarApilado();
    ocultarResultado();
    panel.mostrarRepartir();
    actualizarPuntuacion();
    actualizarRecargas();
    actualizarPuntuacionCrupier(false);
  });

  // --- DESCARTA (recarga) ---

  btnDescartar.addEventListener('click', () => {
    if (state.fase !== 'jugando') return;
    if (state.recargasRestantes <= 0) return;
    const tieneCartas = state.slotsOcupados[0] !== null || state.slotsOcupados[1] !== null;
    if (!tieneCartas) return;
    state.recargasRestantes--;
    if (state.recargasRestantes <= 0) {
      btnDescartar.disabled = true;
      refs.recargasDisplay.classList.add('agotado');
    }
    for (let s = 0; s < 2; s++) {
      const idx = state.slotsOcupados[s];
      if (idx !== null) {
        state.slotsOcupados[s] = null;
        state.cartasDescartadas.add(idx);
        animarADescarte(refs.cartasDOM[idx]);
      }
    }
    actualizarPuntuacion();
    actualizarRecargas();
    let count = 0;
    for (const idx of state.slotsOcupados) {
      if (idx !== null) count++;
    }
    count += state.cartasExtra.length;
    panel.actualizarContador(count, state.maxCartasMano);
    btnPedir.disabled = false;
  });
}
