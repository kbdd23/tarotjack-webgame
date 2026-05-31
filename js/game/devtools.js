// --- DEVTOOLS: botones de depuración (desplegar, apilar, barajar, ordenar) ---

import { state, barajarMazo, ordenarMazo, limpiarMano, hayCartasFuera } from '../core/state.js';
import { refs } from '../ui/dom.js';
import { posicionarApilado, desplegarGrilla } from '../ui/layout.js';
import { actualizarPuntuacion, actualizarPuntuacionCrupier, ocultarResultado } from '../ui/display.js';

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
      refs.cartasDOM.forEach(div => div.classList.remove('carta-oculta'));
      posicionarApilado();
      resetearUI();
    },

    barajar: () => {
      barajarMazo();
      ocultarResultado();
      refs.cartasDOM.forEach(div => div.classList.remove('carta-oculta'));
      if (hayCartasFuera()) desplegarGrilla();
      else posicionarApilado();
      resetearUI();
    },

    ordenar: () => {
      ordenarMazo();
      ocultarResultado();
      refs.cartasDOM.forEach(div => div.classList.remove('carta-oculta'));
      if (hayCartasFuera()) desplegarGrilla();
      else posicionarApilado();
      resetearUI();
    },
  };
}
