// --- DEVTOOLS: botones de depuración (desplegar, apilar, barajar, ordenar) ---

import { state, barajarMazo, ordenarMazo, limpiarMano, hayCartasFuera } from '../core/state.js';
import { refs } from '../ui/dom.js';
import { posicionarApilado, desplegarGrilla } from '../ui/layout.js';
import { actualizarPuntuacion, actualizarPuntuacionCrupier, ocultarResultado } from '../ui/display.js';
import { setDragHabilitado, getDragHabilitado } from './drag.js';

export function setupDevTools(panel) {
  function resetearUI() {
    panel.mostrarRepartir();
    actualizarPuntuacion();
    actualizarPuntuacionCrupier(false);
  }

  return {
    desplegar: () => {
      if (state.desplegadoEnGrilla) posicionarApilado();
      else desplegarGrilla();
    },

    apilar: () => {
      if (!hayCartasFuera()) return;
      limpiarMano();
      ocultarResultado();
      refs.cartasDOM.forEach(div => {
        div.classList.remove('carta-oculta', 'carta-jugador', 'carta-crupier');
      });
      posicionarApilado();
      resetearUI();
    },

    barajar: () => {
      barajarMazo();
      ocultarResultado();
      refs.cartasDOM.forEach(div => {
        div.classList.remove('carta-oculta', 'carta-jugador', 'carta-crupier');
      });
      if (hayCartasFuera()) desplegarGrilla();
      else posicionarApilado();
      resetearUI();
    },

    ordenar: () => {
      ordenarMazo();
      ocultarResultado();
      refs.cartasDOM.forEach(div => {
        div.classList.remove('carta-oculta', 'carta-jugador', 'carta-crupier');
      });
      if (hayCartasFuera()) desplegarGrilla();
      else posicionarApilado();
      resetearUI();
    },

    aumentarMano: () => {
      state.maxCartasMano = Math.min(state.maxCartasMano + 1, 5);

      // Mostrar/ocultar slots según el nuevo límite
      refs.slots.forEach((slot, i) => {
        slot.style.display = i < state.maxCartasMano ? '' : 'none';
      });

      if (state.fase === 'jugando') {
        let count = 0;
        for (let s = 0; s < state.maxCartasMano; s++) {
          if (state.slotsOcupados[s] !== null) count++;
        }
        count += state.cartasExtra.length;
        panel.actualizarContador(count, state.maxCartasMano);

        // Desbloquear PEDIR si hay espacio disponible
        if (refs.btnPedir) {
          refs.btnPedir.disabled = count >= state.maxCartasMano;
        }
      }
    },

    descartarTodas: () => {
      // Mover todas las cartas que no estén en juego a descarte
      for (let i = 0; i < state.baraja.length; i++) {
        if (state.cartasLibres.has(i)) continue;
        if (state.manoCrupier.includes(i)) continue;
        if (state.slotsOcupados.includes(i)) continue;
        if (i === state.cartaOcultaIdx) continue;
        if (state.cartasExtra.includes(i)) continue;
        state.cartasDescartadas.add(i);
      }
      posicionarApilado();
      resetearUI();
    },

    toggleDrag: () => {
      const nuevo = !getDragHabilitado();
      setDragHabilitado(nuevo);
    },
  };
}
