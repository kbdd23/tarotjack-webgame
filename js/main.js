// --- MAIN: bootstrap de la aplicación ---

import { crearBaraja, crearBarajaBlackjack } from './core/deck.js';
import { state, inicializarEstado, limpiarMano, barajarMazo } from './core/state.js';
import {
  crearCartas, refrescarCartas, crearLabels, crearPlaceholders,
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

  const subTopTop = document.createElement('div');
  subTopTop.className = 'sub-inner';
  subTop.appendChild(subTopTop);

  const subTopBottom = document.createElement('div');
  subTopBottom.className = 'sub-inner';
  subTop.appendChild(subTopBottom);

  mesaChica.appendChild(subTop);

  const subMiddle = document.createElement('div');
  subMiddle.className = 'sub-middle';

  const midLeft = document.createElement('div');
  midLeft.className = 'mid-half mid-left';

  const midLeftTop = document.createElement('div');
  midLeftTop.style.display = 'flex';
  midLeftTop.style.flexDirection = 'column';
  midLeftTop.style.flex = '1';
  midLeftTop.style.gap = '6px';
  midLeftTop.style.overflow = 'hidden';

  const midLeftTopInner1 = document.createElement('div');
  midLeftTopInner1.className = 'sub-inner';

  const opcionesBtn = document.createElement('button');
  opcionesBtn.textContent = 'OPCIONES';
  opcionesBtn.style.width = '100%';
  opcionesBtn.style.height = '100%';
  opcionesBtn.style.background = '#1a2a4a';
  opcionesBtn.style.border = '1px solid #d4a017';
  opcionesBtn.style.borderRadius = '8px';
  opcionesBtn.style.color = '#e0eef8';
  opcionesBtn.style.fontSize = '1rem';
  opcionesBtn.style.letterSpacing = '0.3em';
  opcionesBtn.style.fontWeight = 'bold';
  opcionesBtn.style.cursor = 'pointer';
  opcionesBtn.style.fontFamily = "'Courier New', Courier, monospace";
  opcionesBtn.style.transition = 'background 0.2s, color 0.2s';
  opcionesBtn.addEventListener('mouseenter', () => {
    opcionesBtn.style.background = '#2a3a5a';
    opcionesBtn.style.color = '#fff';
  });
  opcionesBtn.addEventListener('mouseleave', () => {
    opcionesBtn.style.background = '#1a2a4a';
    opcionesBtn.style.color = '#e0eef8';
  });
  midLeftTopInner1.appendChild(opcionesBtn);

  // --- PANEL OVERLAY DE OPCIONES (selección de mazo) ---
  const overlay = document.createElement('div');
  overlay.id = 'overlay-opciones';
  Object.assign(overlay.style, {
    position: 'fixed', inset: '0', zIndex: '9999',
    background: 'rgba(0,0,0,0.7)', display: 'none',
    alignItems: 'center', justifyContent: 'center',
  });

  const panelOpc = document.createElement('div');
  Object.assign(panelOpc.style, {
    background: '#0a1628', border: '2px solid #d4a017',
    borderRadius: '12px', padding: '32px 48px',
    minWidth: '320px', textAlign: 'center',
    boxShadow: '0 0 40px rgba(212,160,23,0.3)',
  });

  const titulo = document.createElement('h2');
  titulo.textContent = 'MAZO';
  Object.assign(titulo.style, {
    color: '#d4a017', fontFamily: "'Courier New', monospace",
    fontSize: '1.6rem', letterSpacing: '0.4em', margin: '0 0 24px 0',
  });
  panelOpc.appendChild(titulo);

  const crearBtnMazo = (texto, tipo) => {
    const btn = document.createElement('button');
    btn.textContent = texto;
    Object.assign(btn.style, {
      display: 'block', width: '100%', padding: '14px 0',
      margin: '10px 0', background: '#1a2a4a',
      border: '1px solid #d4a017', borderRadius: '8px',
      color: '#e0eef8', fontSize: '1.2rem', letterSpacing: '0.3em',
      fontWeight: 'bold', cursor: 'pointer', fontFamily: "'Courier New', monospace",
      transition: 'background 0.2s, color 0.2s',
    });
    btn.addEventListener('mouseenter', () => { btn.style.background = '#2a3a5a'; btn.style.color = '#fff'; });
    btn.addEventListener('mouseleave', () => { btn.style.background = '#1a2a4a'; btn.style.color = '#e0eef8'; });
    btn.addEventListener('click', () => cambiarMazo(tipo));
    return btn;
  };

  const cambiarMazo = (tipo) => {
    if (tipo === state.tipoMazo) { overlay.style.display = 'none'; return; }

    const baraja = tipo === 'blackjack' ? crearBarajaBlackjack() : crearBaraja();
    refrescarCartas(baraja, tipo);
    inicializarEstado(baraja, tipo);
    barajarMazo();
    conectarDrag();

    body.classList.toggle('mazo-blackjack', tipo === 'blackjack');

    requestAnimationFrame(() => { posicionarApilado(); });
    overlay.style.display = 'none';
  };

  panelOpc.appendChild(crearBtnMazo('TarotJack', 'tarot'));
  panelOpc.appendChild(crearBtnMazo('BlackJack', 'blackjack'));

  overlay.appendChild(panelOpc);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.style.display = 'none';
  });
  body.appendChild(overlay);

  opcionesBtn.addEventListener('click', () => {
    overlay.style.display = overlay.style.display === 'none' ? 'flex' : 'none';
  });

  midLeftTop.appendChild(midLeftTopInner1);

  const midLeftTopInner2 = document.createElement('div');
  midLeftTopInner2.className = 'sub-inner';

  const retirarseBtn = document.createElement('button');
  retirarseBtn.textContent = 'RETIRARSE';
  retirarseBtn.style.width = '100%';
  retirarseBtn.style.height = '100%';
  retirarseBtn.style.background = '#1a2a4a';
  retirarseBtn.style.border = '1px solid #d4a017';
  retirarseBtn.style.borderRadius = '8px';
  retirarseBtn.style.color = '#e0eef8';
  retirarseBtn.style.fontSize = '1rem';
  retirarseBtn.style.letterSpacing = '0.3em';
  retirarseBtn.style.fontWeight = 'bold';
  retirarseBtn.style.cursor = 'pointer';
  retirarseBtn.style.fontFamily = "'Courier New', Courier, monospace";
  retirarseBtn.style.transition = 'background 0.2s, color 0.2s';
  retirarseBtn.addEventListener('mouseenter', () => {
    retirarseBtn.style.background = '#2a3a5a';
    retirarseBtn.style.color = '#fff';
  });
  retirarseBtn.addEventListener('mouseleave', () => {
    retirarseBtn.style.background = '#1a2a4a';
    retirarseBtn.style.color = '#e0eef8';
  });
  midLeftTopInner2.appendChild(retirarseBtn);

  midLeftTop.appendChild(midLeftTopInner2);

  midLeft.appendChild(midLeftTop);

  const midLeftBottom = document.createElement('div');
  midLeftBottom.className = 'mid-half-inner';
  midLeftBottom.style.flex = '0 0 auto';
  midLeftBottom.style.background = '#1a3a1a';
  midLeftBottom.style.border = '1px solid #d4a017';
  midLeftBottom.style.borderRadius = '6px';
  midLeftBottom.style.padding = '10px';
  midLeftBottom.style.gap = '8px';
  midLeftBottom.style.cursor = 'pointer';
  midLeftBottom.style.transition = 'background 0.2s';
  midLeftBottom.addEventListener('mouseenter', () => { midLeftBottom.style.background = '#2a4a2a'; });
  midLeftBottom.addEventListener('mouseleave', () => { midLeftBottom.style.background = '#1a3a1a'; });

  const shopLabel = document.createElement('span');
  shopLabel.textContent = 'TIENDA';
  shopLabel.style.color = '#ddd';
  shopLabel.style.fontSize = '0.75rem';
  shopLabel.style.letterSpacing = '0.3em';
  shopLabel.style.fontWeight = 'bold';
  shopLabel.style.padding = '4px 18px';
  shopLabel.style.border = '1px solid rgba(212, 160, 23, 0.3)';
  shopLabel.style.borderRadius = '10px';
  shopLabel.style.background = 'transparent';
  midLeftBottom.appendChild(shopLabel);

  const shopCount = document.createElement('div');
  shopCount.textContent = '0';
  shopCount.style.flex = '1';
  shopCount.style.display = 'flex';
  shopCount.style.alignItems = 'center';
  shopCount.style.justifyContent = 'center';
  shopCount.style.color = '#ddd';
  shopCount.style.fontSize = '2rem';
  shopCount.style.fontWeight = 'bold';
  shopCount.style.cursor = 'pointer';
  shopCount.style.transition = 'color 0.2s';
  shopCount.addEventListener('mouseenter', () => { shopCount.style.color = '#fff'; });
  shopCount.addEventListener('mouseleave', () => { shopCount.style.color = '#ddd'; });
  midLeftBottom.appendChild(shopCount);

  midLeft.appendChild(midLeftBottom);

  subMiddle.appendChild(midLeft);

  const midRight = document.createElement('div');
  midRight.className = 'mid-half mid-right';

  const midRightTop = document.createElement('div');
  midRightTop.className = 'mid-half-inner';
  midRightTop.style.background = '#7a0e0e';
  midRightTop.style.border = '1px solid #d4a017';
  midRightTop.style.borderRadius = '6px';
  midRightTop.style.padding = '10px';
  midRightTop.style.gap = '8px';

  const roundLabel = document.createElement('span');
  roundLabel.textContent = 'RONDA';
  roundLabel.style.color = '#ddd';
  roundLabel.style.fontSize = '0.75rem';
  roundLabel.style.letterSpacing = '0.3em';
  roundLabel.style.fontWeight = 'bold';
  roundLabel.style.padding = '4px 18px';
  roundLabel.style.border = '1px solid rgba(212, 160, 23, 0.3)';
  roundLabel.style.borderRadius = '10px';
  roundLabel.style.background = 'transparent';
  midRightTop.appendChild(roundLabel);

  const roundCount = document.createElement('div');
  roundCount.textContent = '0';
  roundCount.style.flex = '1';
  roundCount.style.display = 'flex';
  roundCount.style.alignItems = 'center';
  roundCount.style.justifyContent = 'center';
  roundCount.style.color = '#ddd';
  roundCount.style.fontSize = '2rem';
  roundCount.style.fontWeight = 'bold';
  midRightTop.appendChild(roundCount);
  refs.rondaDisplay = roundCount;

  midRight.appendChild(midRightTop);

  const midRightBottom = document.createElement('div');
  midRightBottom.className = 'mid-half-inner';
  midRightBottom.style.background = '#7a0e0e';
  midRightBottom.style.border = '1px solid #d4a017';
  midRightBottom.style.borderRadius = '6px';
  midRightBottom.style.padding = '10px';
  midRightBottom.style.gap = '8px';

  const descLabel = document.createElement('span');
  descLabel.textContent = 'DESCARTES';
  descLabel.style.color = '#ddd';
  descLabel.style.fontSize = '0.75rem';
  descLabel.style.letterSpacing = '0.3em';
  descLabel.style.fontWeight = 'bold';
  descLabel.style.padding = '4px 18px';
  descLabel.style.border = '1px solid rgba(212, 160, 23, 0.3)';
  descLabel.style.borderRadius = '10px';
  descLabel.style.background = 'transparent';
  midRightBottom.appendChild(descLabel);

  const descCount = document.createElement('div');
  descCount.textContent = '3/3';
  descCount.style.flex = '1';
  descCount.style.display = 'flex';
  descCount.style.alignItems = 'center';
  descCount.style.justifyContent = 'center';
  descCount.style.color = '#ddd';
  descCount.style.fontSize = '2rem';
  descCount.style.fontWeight = 'bold';
  midRightBottom.appendChild(descCount);

  refs.descarteDisplay = descCount;

  midRight.appendChild(midRightBottom);

  subMiddle.appendChild(midRight);

  mesaChica.appendChild(subMiddle);

  const subBottom = document.createElement('div');
  subBottom.className = 'sub-seccion sub-bottom';
  mesaChica.appendChild(subBottom);

  body.insertBefore(mesaChica, mesa);

  // --- BARAJAS Y ESTADO ---
  const baraja = crearBarajaBlackjack();
  inicializarEstado(baraja, 'blackjack');
  barajarMazo();
  body.classList.add('mazo-blackjack');

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
  setup(panel, btnRepartir, btnPedir, btnJugar, btnNuevaMano, btnDescartar, retirarseBtn);

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

  const btnMasCarta = document.createElement('button');
  btnMasCarta.className = 'dev-btn';
  btnMasCarta.textContent = '+1 CARTA';
  btnMasCarta.addEventListener('click', devTools.aumentarMano);
  devToolsContainer.appendChild(btnMasCarta);

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
