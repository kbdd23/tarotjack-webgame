// --- MAIN: bootstrap de la aplicación ---

import { crearBaraja } from './core/deck.js';
import { state, inicializarEstado } from './core/state.js';
import {
  crearCartas, crearLabels, crearPlaceholders,
  crearZonaDescarte, crearZonaCrupier, crearResultadoDisplay,
  refs,
} from './ui/dom.js';
import { posicionarApilado } from './ui/layout.js';
import { ocultarResultado, actualizarPuntuacion, actualizarPuntuacionCrupier } from './ui/display.js';
import { setup } from './game/controls.js';
import { conectarDrag } from './game/drag.js';
import { setupDevTools } from './game/devtools.js';
import { setupPanel } from './ui/panel.js';

document.addEventListener('DOMContentLoaded', () => {
  const mesa = document.getElementById('mesa');
  const body = document.body;
  mesa.querySelector('h1').textContent = 'TAROTJACK';

  // --- MESA CHICA (lateral o subMesa) ---
  const mesaChica = document.createElement('div');
  mesaChica.id = 'mesa-chica';

  const subTop = document.createElement('div');
  subTop.className = 'sub-seccion sub-superior';
  mesaChica.appendChild(subTop);

  const subBottom = document.createElement('div');
  subBottom.className = 'sub-seccion sub-bottom';
  mesaChica.appendChild(subBottom);

  body.insertBefore(mesaChica, mesa);

  // --- BARAJAS Y ESTADO ---
  const baraja = crearBaraja();
  inicializarEstado(baraja);

  // --- ZONA DE CARTAS ---
  const zona = document.createElement('div');
  zona.id = 'zona-cartas';
  mesa.appendChild(zona);

  // --- CREAR TODO EL DOM ---
  crearCartas(baraja, zona);
  crearLabels(zona);
  crearZonaDescarte(zona);
  crearZonaCrupier(zona);
  crearResultadoDisplay(zona);
  crearPlaceholders(zona);
  ocultarResultado();

  // --- BOTONES EN SUB-BOTTOM ---
  const btnNuevaMano = document.createElement('button');
  btnNuevaMano.id = 'btn-nueva-mano';
  btnNuevaMano.textContent = 'NUEVA MANO';
  btnNuevaMano.title = 'Empezar nueva mano';
  btnNuevaMano.style.display = 'none';
  subBottom.appendChild(btnNuevaMano);

  const btnRepartir = document.createElement('button');
  btnRepartir.id = 'btn-repartir';
  btnRepartir.textContent = 'REPARTIR';
  subBottom.appendChild(btnRepartir);

  const contadorDisplay = document.createElement('div');
  contadorDisplay.id = 'contador-mano';
  contadorDisplay.textContent = '0/2';
  contadorDisplay.style.display = 'none';
  subBottom.appendChild(contadorDisplay);

  // --- BOTONES EN MESA ---
  const btnDescartar = document.createElement('button');
  btnDescartar.id = 'btn-descartar';
  btnDescartar.textContent = '\u21BB';
  btnDescartar.title = 'Descartar mano';
  refs.btnRow.appendChild(btnDescartar);
  refs.btnDescartar = btnDescartar;

  const btnPedir = document.createElement('button');
  btnPedir.id = 'btn-pedir';
  btnPedir.textContent = 'PEDIR';
  btnPedir.title = 'Pedir otra carta';
  btnPedir.disabled = true;
  btnPedir.style.display = 'none';
  mesa.appendChild(btnPedir);
  refs.btnPedir = btnPedir;

  const btnJugar = document.createElement('button');
  btnJugar.id = 'btn-jugar';
  btnJugar.textContent = 'JUGAR';
  btnJugar.title = 'Plantarse';
  btnJugar.disabled = true;
  refs.btnRow.appendChild(btnJugar);
  refs.btnJugar = btnJugar;

  // --- PANEL DE CONTROL ---
  const panel = setupPanel(btnRepartir, contadorDisplay, btnPedir, btnJugar, btnNuevaMano);

  // --- CONECTAR CONTROLES ---
  setup(panel, btnRepartir, btnPedir, btnJugar, btnNuevaMano, btnDescartar);

  // --- DRAG & DROP ---
  conectarDrag();

  // --- DEV-TOOLS ---
  const devTools = setupDevTools(panel);

  const devToolsContainer = document.createElement('div');
  devToolsContainer.id = 'dev-tools';

  const btnDesplegar = document.createElement('button');
  btnDesplegar.className = 'dev-btn';
  btnDesplegar.textContent = 'DESPLEGAR';
  btnDesplegar.addEventListener('click', devTools.desplegar);
  devToolsContainer.appendChild(btnDesplegar);

  const btnApilar = document.createElement('button');
  btnApilar.className = 'dev-btn';
  btnApilar.textContent = 'APILAR';
  btnApilar.addEventListener('click', devTools.apilar);
  devToolsContainer.appendChild(btnApilar);

  const btnBarajar = document.createElement('button');
  btnBarajar.className = 'dev-btn';
  btnBarajar.textContent = 'BARAJAR';
  btnBarajar.addEventListener('click', devTools.barajar);
  devToolsContainer.appendChild(btnBarajar);

  const btnOrdenar = document.createElement('button');
  btnOrdenar.className = 'dev-btn';
  btnOrdenar.textContent = 'ORDENAR';
  btnOrdenar.addEventListener('click', devTools.ordenar);
  devToolsContainer.appendChild(btnOrdenar);

  body.appendChild(devToolsContainer);

  // --- INICIO ---
  requestAnimationFrame(() => {
    posicionarApilado();
  });

  // --- RESIZE ---
  window.addEventListener('resize', () => {
    if (state.desplegadoEnGrilla) {
      import('./ui/layout.js').then(m => m.desplegarGrilla());
    } else {
      posicionarApilado();
    }
  });
});
