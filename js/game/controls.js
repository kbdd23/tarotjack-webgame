// --- CONTROLS: handlers del juego (repartir, pedir, jugar, nueva mano, descartar) ---
//
// Responsabilidad: conectar eventos del usuario con la lógica del juego.
// El estado visual de los botones se delega en `panel`.

import {
  state,
  sacarDelMazo, limpiarMano, barajarMazo, finalizarRonda, hacerReshuffle,
} from '../core/state.js';
import { refs } from '../ui/dom.js';
import {
  posicionarApilado, posicionarCrupier, posicionarExtra,
  animarADescarte, escalarASlot, animarReshuffle,
} from '../ui/layout.js';
import {
  actualizarPuntuacion, actualizarPuntuacionCrupier,
  actualizarRecargas, ocultarResultado,
} from '../ui/display.js';
import { iniciarTurno } from './crupier.js';

export function setup(panel, btnRepartir, btnPedir, btnJugar, btnNuevaMano, btnDescartar, btnRetirarse) {

  /** Helper que obtiene una carta del mazo. Si no quedan, hace reshuffle (descarte→mazo),
   *  anima, espera 2s y reintenta. */
  async function _sacarCarta() {
    let idx = sacarDelMazo();
    if (idx !== null) return idx;
    if (state.cartasDescartadas.size === 0) return null;

    hacerReshuffle();
    animarReshuffle();

    refs.resultadoDisplay.textContent = 'RECARGANDO BARAJA';
    refs.resultadoDisplay.className = 'recargando';
    refs.resultadoDisplay.style.display = 'block';

    // Barajar rítmicamente al compás del pulso para efecto de "revolviendo"
    const ritmo = setInterval(() => {
      for (let i = state.ordenActual.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.ordenActual[i], state.ordenActual[j]] = [state.ordenActual[j], state.ordenActual[i]];
      }
      state.barajeado = true;
      // Actualizar zIndex de las cartas del mazo (sin reposicionar todo)
      refs.cartasDOM.forEach((div, i) => {
        if (div.style.display === 'none') return;
        const pos = state.ordenActual.indexOf(i);
        if (pos !== -1) div.style.zIndex = pos;
      });
    }, 300);

    await new Promise(r => setTimeout(r, 2000));

    clearInterval(ritmo);
    idx = sacarDelMazo();
    state.reshuffleReciente = false;
    ocultarResultado();
    return idx;
  }

  // --- REPARTIR ---

  btnRepartir.addEventListener('click', async () => {
    if (state.fase === 'jugando') return;

    // Animación de barajado inicial solo en la primera ronda
    if (state.rondaActual === 0) {
      refs.resultadoDisplay.textContent = 'BARAJANDO';
      refs.resultadoDisplay.className = 'recargando';
      refs.resultadoDisplay.style.display = 'block';

      const ritmo = setInterval(() => {
        for (let i = state.ordenActual.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [state.ordenActual[i], state.ordenActual[j]] = [state.ordenActual[j], state.ordenActual[i]];
        }
        state.barajeado = true;
        refs.cartasDOM.forEach((div, i) => {
          if (div.style.display === 'none') return;
          const pos = state.ordenActual.indexOf(i);
          if (pos !== -1) div.style.zIndex = pos;
        });
      }, 300);

      await new Promise(r => setTimeout(r, 2000));
      clearInterval(ritmo);
      ocultarResultado();
    }

    limpiarMano();
    ocultarResultado();

    // Secuencia: una al jugador → una al crupier → otra al jugador
    const cj1 = await _sacarCarta();
    if (cj1 === null) return;
    state.slotsOcupados[0] = cj1;
    escalarASlot(refs.cartasDOM[cj1], 0);

    const cc1 = await _sacarCarta();
    if (cc1 === null) { limpiarMano(); return; }
    state.manoCrupier = [cc1];

    const cj2 = await _sacarCarta();
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

  btnPedir.addEventListener('click', async () => {
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

    const cartaIdx = await _sacarCarta();
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

  btnDescartar.addEventListener('click', async () => {
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
      const oculta = await _sacarCarta();
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
