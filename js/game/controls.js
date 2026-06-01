// --- CONTROLS: handlers del juego (repartir, pedir, jugar, nueva mano, descartar) ---
//
// Responsabilidad: conectar eventos del usuario con la lógica del juego.
// El estado visual de los botones se delega en `panel`.

import {
  state,
  sacarDelMazo, limpiarMano, barajarMazo, finalizarRonda,
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
import { iniciarTurno } from './crupier.js';

export function setup(panel, btnRepartir, btnPedir, btnJugar, btnNuevaMano, btnDescartar, btnRetirarse) {

  // --- REPARTIR ---

  btnRepartir.addEventListener('click', () => {
    if (state.fase === 'jugando') return;

    limpiarMano();
    ocultarResultado();

    // Secuencia: una al jugador → una al crupier → otra al jugador
    const cj1 = sacarDelMazo();
    if (cj1 === null) return;
    state.slotsOcupados[0] = cj1;
    escalarASlot(refs.cartasDOM[cj1], 0);

    const cc1 = sacarDelMazo();
    if (cc1 === null) { limpiarMano(); return; }
    state.manoCrupier = [cc1];

    const cj2 = sacarDelMazo();
    if (cj2 === null) { limpiarMano(); return; }
    state.slotsOcupados[1] = cj2;
    escalarASlot(refs.cartasDOM[cj2], 1);

    // Crupier sin carta oculta inicial
    state.cartaOcultaIdx = null;

    setTimeout(() => { posicionarCrupier(); }, 300);

    state.fase = 'jugando';
    btnRepartir.style.display = 'none';
    panel.actualizarContador(2, state.maxCartasMano);
    actualizarPuntuacion();
    panel.mostrarJuego();
    state.rondaActual += 1;
    refs.rondaDisplay.textContent = state.rondaActual;

    // Habilitar PEDIR si el handicap permite más cartas
    if (state.maxCartasMano > 2) btnPedir.disabled = false;
  });

  // --- PEDIR (hit) ---

  btnPedir.addEventListener('click', () => {
    if (state.fase !== 'jugando') return;

    let countAct = 0;
    for (let s = 0; s < state.maxCartasMano; s++) {
      if (state.slotsOcupados[s] !== null) countAct++;
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
    for (let s = 0; s < state.maxCartasMano; s++) {
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
    for (let s = 0; s < state.maxCartasMano; s++) {
      if (state.slotsOcupados[s] !== null) nuevoCount++;
    }
    nuevoCount += state.cartasExtra.length;
    panel.actualizarContador(nuevoCount, state.maxCartasMano);

    if (nuevoCount >= state.maxCartasMano) {
      btnPedir.disabled = true;
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
    const resultado = state.resultado;

    if (resultado === 'perdiste') {
      barajarMazo();
      state.rondaActual = 0;
    } else {
      finalizarRonda();
    }
    state.maxCartasMano = 2;
    refs.rondaDisplay.textContent = state.rondaActual;

    refs.btnDescartar.disabled = false;
    refs.recargasDisplay.classList.remove('agotado');

    // Restaurar slots a solo 2 visibles
    refs.slots.forEach((slot, i) => {
      slot.style.display = i < 2 ? '' : 'none';
    });

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

    // Verificar si hay al menos una carta en los slots activos
    let tieneCartas = false;
    for (let s = 0; s < state.maxCartasMano; s++) {
      if (state.slotsOcupados[s] !== null) { tieneCartas = true; break; }
    }
    if (!tieneCartas) return;

    state.recargasRestantes--;
    if (state.recargasRestantes <= 0) {
      btnDescartar.disabled = true;
      refs.recargasDisplay.classList.add('agotado');
    }

    // Descartar slots activos
    for (let s = 0; s < state.maxCartasMano; s++) {
      const idx = state.slotsOcupados[s];
      if (idx !== null) {
        state.slotsOcupados[s] = null;
        state.cartasDescartadas.add(idx);
        animarADescarte(refs.cartasDOM[idx]);
      }
    }

    // Descartar cartas extra también
    for (const idx of state.cartasExtra) {
      state.cartasDescartadas.add(idx);
      animarADescarte(refs.cartasDOM[idx]);
    }
    state.cartasExtra = [];

    // Si el crupier no tiene carta oculta aún, la roba
    if (state.cartaOcultaIdx === null) {
      const oculta = sacarDelMazo();
      if (oculta !== null) {
        state.cartaOcultaIdx = oculta;
        posicionarCrupier();
      }
    }

    actualizarPuntuacion();
    actualizarRecargas();
    let count = 0;
    for (let s = 0; s < state.maxCartasMano; s++) {
      if (state.slotsOcupados[s] !== null) count++;
    }
    count += state.cartasExtra.length;
    panel.actualizarContador(count, state.maxCartasMano);
    btnPedir.disabled = false;
  });

  // --- RETIRARSE ---

  btnRetirarse.addEventListener('click', () => {
    if (state.fase === 'esperando') return;

    barajarMazo();
    state.maxCartasMano = 2;
    state.rondaActual = 0;
    refs.rondaDisplay.textContent = state.rondaActual;

    refs.btnDescartar.disabled = false;
    refs.recargasDisplay.classList.remove('agotado');

    // Restaurar slots a solo 2 visibles
    refs.slots.forEach((slot, i) => {
      slot.style.display = i < 2 ? '' : 'none';
    });

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
}
