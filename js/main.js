// --- MAIN: bootstrap de la aplicación ---
//
// Responsabilidad:
//   1. Inicializar baraja, estado, DOM de zona-cartas
//   2. Instanciar submesa (UI lateral) y overlay de opciones
//   3. Conectar controles, drag, devtools
//   4. Posicionamiento inicial y resize

import { crearBarajaBlackjack, crearBaraja } from './core/deck/barrel.js';
import { state, inicializarEstado, barajarMazo } from './core/state.js';
import {
  crearCartas, refrescarCartas, crearLabels, crearPlaceholders,
  crearZonaDescarte, crearZonaCrupier, crearResultadoDisplay,
  refs,
} from './ui/dom.js';
import { crearSubmesa } from './ui/submesa/barrel.js';
import { posicionarApilado } from './ui/layout.js';
import { ocultarResultado, actualizarPuntuacion, actualizarPuntuacionCrupier } from './ui/display.js';
import { setup } from './game/controls.js';
import { conectarDrag } from './game/drag.js';
import { setupDevTools } from './game/devtools.js';

document.addEventListener('DOMContentLoaded', () => {
  const mesa = document.getElementById('mesa');
  const body = document.body;
  mesa.querySelector('h1').textContent = 'TAROTJACK';

  // ── BARAJAS Y ESTADO ──────────────────────────────────────────
  const baraja = crearBarajaBlackjack();
  inicializarEstado(baraja, 'blackjack');
  barajarMazo();
  body.classList.add('mazo-blackjack');

  // ── ZONA DE CARTAS ────────────────────────────────────────────
  const zona = document.createElement('div');
  zona.id = 'zona-cartas';
  mesa.appendChild(zona);

  crearCartas(baraja, zona);
  crearLabels(zona);
  crearZonaDescarte(zona);
  crearZonaCrupier(zona);
  crearResultadoDisplay(zona);
  crearPlaceholders(zona);
  ocultarResultado();

  // ── SUBMESA ───────────────────────────────────────────────────
  const sub = crearSubmesa(body, mesa);

  // ── OVERLAY OPCIONES: botones de mazo ─────────────────────────
  const crearBtnMazo = (texto, tipo, disabled = false) => {
    const btn = document.createElement('button');
    btn.textContent = texto + (disabled ? ' (PRONTO)' : '');
    btn.disabled = disabled;
    Object.assign(btn.style, {
      display: 'block', width: '100%', padding: '14px 0',
      margin: '10px 0', background: '#1a2a4a',
      border: '1px solid #d4a017', borderRadius: '8px',
      color: '#e0eef8', fontSize: '1.2rem', letterSpacing: '0.3em',
      fontWeight: 'bold', cursor: 'pointer', fontFamily: "'Courier New', monospace",
      transition: 'background 0.2s, color 0.2s',
    });
    if (disabled) {
      btn.style.opacity = '0.4';
      btn.style.cursor = 'not-allowed';
    }
    btn.addEventListener('mouseenter', () => { if (!disabled) { btn.style.background = '#2a3a5a'; btn.style.color = '#fff'; } });
    btn.addEventListener('mouseleave', () => { if (!disabled) { btn.style.background = '#1a2a4a'; btn.style.color = '#e0eef8'; } });
    btn.addEventListener('click', () => { if (!disabled) cambiarMazo(tipo); });
    return btn;
  };

  const cambiarMazo = (tipo) => {
    if (tipo === state.tipoMazo) { sub.overlay.style.display = 'none'; return; }

    const nuevaBaraja = tipo === 'blackjack' ? crearBarajaBlackjack() : crearBaraja();
    refrescarCartas(nuevaBaraja, tipo);
    inicializarEstado(nuevaBaraja, tipo);
    barajarMazo();
    conectarDrag();

    body.classList.toggle('mazo-blackjack', tipo === 'blackjack');

    requestAnimationFrame(() => { posicionarApilado(); });
    sub.overlay.style.display = 'none';
  };

  sub.panelOpc.appendChild(crearBtnMazo('TarotJack', 'tarot', true));
  sub.panelOpc.appendChild(crearBtnMazo('BlackJack', 'blackjack'));

  // ── CONTROLES ─────────────────────────────────────────────────
  setup(sub.panel, sub.btnRepartir, sub.btnPedir, sub.btnJugar,
        sub.btnNuevaMano, sub.btnDescartar, sub.retirarseBtn);

  // ── DRAG & DROP ───────────────────────────────────────────────
  conectarDrag();

  // ── DEVTOOLS ──────────────────────────────────────────────────
  const devTools = setupDevTools(sub.panel);

  const crearDevBtn = (texto, handler) => {
    const btn = document.createElement('button');
    btn.className = 'dev-btn';
    btn.textContent = texto;
    btn.addEventListener('click', handler);
    return btn;
  };

  // Botón toggle visible siempre + grupo colapsable
  const btnToggleDev = document.createElement('button');
  btnToggleDev.className = 'dev-btn';
  btnToggleDev.textContent = 'DEV';
  btnToggleDev.style.border = '1px solid #d4a017';

  const devGroup = document.createElement('div');
  devGroup.style.display = 'none';
  devGroup.style.flexDirection = 'column';
  devGroup.style.gap = '4px';

  devGroup.appendChild(crearDevBtn('DESPLEGAR', devTools.desplegar));
  devGroup.appendChild(crearDevBtn('APILAR', devTools.apilar));
  devGroup.appendChild(crearDevBtn('BARAJAR', devTools.barajar));
  devGroup.appendChild(crearDevBtn('ORDENAR', devTools.ordenar));
  devGroup.appendChild(crearDevBtn('DESC. TODAS', devTools.descartarTodas));
  devGroup.appendChild(crearDevBtn('DRAG', devTools.toggleDrag));
  devGroup.appendChild(crearDevBtn('-1 HP', devTools.bajarHp));

  btnToggleDev.addEventListener('click', () => {
    devGroup.style.display = devGroup.style.display === 'none' ? 'flex' : 'none';
  });

  sub.devToolsContainer.appendChild(btnToggleDev);
  sub.devToolsContainer.appendChild(devGroup);
  body.appendChild(sub.devToolsContainer);

  // ── INICIO ────────────────────────────────────────────────────
  requestAnimationFrame(() => {
    posicionarApilado();
  });

  // ── RESIZE ────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    if (state.desplegadoEnGrilla) {
      import('./ui/layout.js').then(m => m.desplegarGrilla());
    } else {
      posicionarApilado();
    }
  });
});
