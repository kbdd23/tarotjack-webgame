// --- OVERLAYS: modal de opciones + botón disparador ---
//
// Crea el botón OPCIONES (dentro de midLeftTop), el overlay modal
// con su panel (panelOpc) y conecta el toggle click.

import { state, BOSSES } from '../../core/state.js';
import { actualizarHpDisplay, temblarCrupier } from '../display.js';

export function crearOverlay(body, midLeftTop) {
  // ── BOTÓN OPCIONES ──
  const inner = document.createElement('div');
  inner.className = 'sub-inner';

  const opcionesBtn = document.createElement('button');
  opcionesBtn.textContent = 'OPCIONES';
  Object.assign(opcionesBtn.style, {
    width: '100%', height: '100%',
    background: '#1a2a4a', border: '1px solid #d4a017',
    borderRadius: '8px', color: '#e0eef8',
    fontSize: '1rem', letterSpacing: '0.3em',
    fontWeight: 'bold', cursor: 'pointer',
    fontFamily: "'Courier New', Courier, monospace",
    transition: 'background 0.2s, color 0.2s',
  });
  opcionesBtn.addEventListener('mouseenter', () => {
    opcionesBtn.style.background = '#2a3a5a'; opcionesBtn.style.color = '#fff';
  });
  opcionesBtn.addEventListener('mouseleave', () => {
    opcionesBtn.style.background = '#1a2a4a'; opcionesBtn.style.color = '#e0eef8';
  });

  inner.appendChild(opcionesBtn);
  midLeftTop.appendChild(inner);

  // ── OVERLAY MODAL ──
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

  const tituloOpc = document.createElement('h2');
  tituloOpc.textContent = 'MAZO';
  Object.assign(tituloOpc.style, {
    color: '#d4a017', fontFamily: "'Courier New', monospace",
    fontSize: '1.6rem', letterSpacing: '0.4em', margin: '0 0 24px 0',
  });
  panelOpc.appendChild(tituloOpc);

  overlay.appendChild(panelOpc);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.style.display = 'none';
  });
  body.appendChild(overlay);

  // ── WIRING ──
  opcionesBtn.addEventListener('click', () => {
    overlay.style.display = overlay.style.display === 'none' ? 'flex' : 'none';
  });

  return { overlay, panelOpc, opcionesBtn };
}

// ── OVERLAY DE PERSONAJE (selector de color de ficha) ──

export function crearOverlayPersonaje(body) {
  const overlay = document.createElement('div');
  overlay.id = 'overlay-personaje';
  Object.assign(overlay.style, {
    position: 'fixed', inset: '0', zIndex: '10000',
    background: 'rgba(0,0,0,0.7)', display: 'none',
    alignItems: 'center', justifyContent: 'center',
  });

  const panel = document.createElement('div');
  Object.assign(panel.style, {
    background: '#0a1628', border: '2px solid #d4a017',
    borderRadius: '12px', padding: '32px 48px',
    minWidth: '320px', textAlign: 'center',
    boxShadow: '0 0 40px rgba(212,160,23,0.3)',
  });

  const titulo = document.createElement('h2');
  titulo.textContent = 'FICHA';
  Object.assign(titulo.style, {
    color: '#d4a017', fontFamily: "'Courier New', monospace",
    fontSize: '1.6rem', letterSpacing: '0.4em', margin: '0 0 24px 0',
  });
  panel.appendChild(titulo);

  const colores = [
    { nombre: 'Azul',    hex: '#3a7bd5' },
    { nombre: 'Rojo',    hex: '#d53a3a' },
    { nombre: 'Violeta', hex: '#9b59b6' },
    { nombre: 'Negro',   hex: '#2c3e50' },
    { nombre: 'Verde',   hex: '#27ae60' },
  ];

  const botones = colores.map(c => {
    const btn = document.createElement('button');
    btn.innerHTML = `<span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:${c.hex};vertical-align:middle;margin-right:12px;border:1px solid rgba(255,255,255,0.2);"></span>${c.nombre}`;
    Object.assign(btn.style, {
      display: 'block', width: '100%', padding: '12px 0',
      margin: '8px 0', background: '#1a2a4a',
      border: '1px solid #d4a017', borderRadius: '8px',
      color: '#e0eef8', fontSize: '1.1rem', letterSpacing: '0.3em',
      fontWeight: 'bold', cursor: 'pointer',
      fontFamily: "'Courier New', monospace",
      transition: 'background 0.2s, color 0.2s',
      textAlign: 'left', paddingLeft: '32px',
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#2a3a5a'; btn.style.color = '#fff';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = '#1a2a4a'; btn.style.color = '#e0eef8';
    });
    panel.appendChild(btn);
    return { btn, color: c };
  });

  overlay.appendChild(panel);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.style.display = 'none';
  });
  body.appendChild(overlay);

  function mostrarOverlay() {
    overlay.style.display = 'flex';
  }

  function conectarWidget(fichaEl, labelEl, temblarFn) {
    botones.forEach(({ btn, color }) => {
      btn.addEventListener('click', () => {
        fichaEl.style.background = color.hex;
        labelEl.textContent = color.nombre;
        if (temblarFn) temblarFn();
        overlay.style.display = 'none';
      });
    });
  }

  return { overlayPersonaje: overlay, mostrarOverlay, conectarWidget };
}

// ── OVERLAY DE CRUPIER (selector de imagen) ──

export function crearOverlayCrupier(body) {
  const overlay = document.createElement('div');
  overlay.id = 'overlay-crupier';
  Object.assign(overlay.style, {
    position: 'fixed', inset: '0', zIndex: '10000',
    background: 'rgba(0,0,0,0.7)', display: 'none',
    alignItems: 'center', justifyContent: 'center',
  });

  const panel = document.createElement('div');
  Object.assign(panel.style, {
    background: '#0a1628', border: '2px solid #d4a017',
    borderRadius: '12px', padding: '32px 48px',
    minWidth: '320px', textAlign: 'center',
    boxShadow: '0 0 40px rgba(212,160,23,0.3)',
  });

  const titulo = document.createElement('h2');
  titulo.textContent = 'CRUPIER';
  Object.assign(titulo.style, {
    color: '#d4a017', fontFamily: "'Courier New', monospace",
    fontSize: '1.6rem', letterSpacing: '0.4em', margin: '0 0 24px 0',
  });
  panel.appendChild(titulo);

  const botones = BOSSES.map((c, i) => {
    const btn = document.createElement('button');
    btn.textContent = c.nombre;
    Object.assign(btn.style, {
      display: 'block', width: '100%', padding: '12px 0',
      margin: '8px 0', background: '#1a2a4a',
      border: '1px solid #d4a017', borderRadius: '8px',
      color: '#e0eef8', fontSize: '1.1rem', letterSpacing: '0.3em',
      fontWeight: 'bold', cursor: 'pointer',
      fontFamily: "'Courier New', monospace",
      transition: 'background 0.2s, color 0.2s',
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#2a3a5a'; btn.style.color = '#fff';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = '#1a2a4a'; btn.style.color = '#e0eef8';
    });
    panel.appendChild(btn);
    return { btn, boss: c, idx: i };
  });

  overlay.appendChild(panel);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.style.display = 'none';
  });
  body.appendChild(overlay);

  function mostrarOverlay() {
    overlay.style.display = 'flex';
  }

  function conectarCrupier(imgEl, labelEl) {
    botones.forEach(({ btn, boss, idx }) => {
      btn.addEventListener('click', () => {
        imgEl.src = `assets/crupiers/${boss.archivo}`;
        labelEl.textContent = boss.nombre;
        state.bossActual = idx;
        state.hpCrupierRestante = boss.hp;
        console.log('Boss cambiado a', boss.nombre, 'HP:', state.hpCrupierRestante);
        actualizarHpDisplay(boss.hp);
        temblarCrupier();
        overlay.style.display = 'none';
      });
    });
  }

  return { overlayCrupier: overlay, mostrarOverlay, conectarCrupier };
}
