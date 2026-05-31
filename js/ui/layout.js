// --- UI: posicionamiento y animaciones de cartas ---

import { state } from '../core/state.js';
import { refs } from './dom.js';
import { mostrarPlaceholders, mostrarDescarte, actualizarPuntuacionCrupier } from './display.js';

const LABEL_W = 28;

// --- UTILIDAD DE POSICIÓN ---

export function obtenerPosTransform(div) {
  const t = div.style.transform;
  if (!t || t === 'none') return { x: 0, y: 0 };
  const match = t.match(/translate\(([\d.-]+)px,\s*([\d.-]+)px\)/);
  if (match) return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
  return { x: 0, y: 0 };
}

// --- FILTRO: ¿carta está en juego? ---

function esCartaEnJuego(idx) {
  if (state.cartasLibres.has(idx)) return true;
  if (state.cartasDescartadas.has(idx)) return true;
  if (state.manoCrupier.includes(idx)) return true;
  if (idx === state.cartaOcultaIdx) return true;
  if (state.cartasExtra.includes(idx)) return true;
  return false;
}

// --- APILADO (mazo) ---

export function posicionarApilado() {
  const zonaRect = refs.zona.getBoundingClientRect();
  const x = Math.round(zonaRect.width - 80 - 16);
  const y = 70;

  refs.cartasDOM.forEach((div, i) => {
    if (esCartaEnJuego(i)) return;
    div.style.width = '80px';
    div.style.height = '110px';
    div.style.transform = `translate(${x}px, ${y}px)`;
    const posEnOrden = state.ordenActual.indexOf(i);
    div.style.zIndex = posEnOrden;
  });

  posicionarDescartes();
  refs.labels.forEach(l => { l.style.display = 'none'; });
  state.desplegadoEnGrilla = false;
  mostrarPlaceholders(true);
  mostrarDescarte(true);
}

// --- DESCARTES ---

export function posicionarDescartes() {
  const dx = 12;
  const dy = 12;

  refs.cartasDOM.forEach((div, i) => {
    if (!state.cartasDescartadas.has(i)) return;
    div.style.width = '80px';
    div.style.height = '110px';
    div.style.transform = `translate(${dx}px, ${dy}px)`;
    div.style.zIndex = 1;
    div.classList.remove('carta-oculta');
  });
}

// --- CRUPIER ---

export function posicionarCrupier() {
  const zonaRect = refs.zona.getBoundingClientRect();
  const CARD_W = 120, CARD_H = 165, GAP = 30;
  const totalW = (state.manoCrupier.length + (state.cartaOcultaIdx !== null ? 1 : 0)) * (CARD_W + GAP) - GAP;
  const cx = Math.round((zonaRect.width - totalW) / 2);

  state.manoCrupier.forEach((idx, i) => {
    const div = refs.cartasDOM[idx];
    const sx = cx + i * (CARD_W + GAP);
    const sy = 90;
    div.style.width = CARD_W + 'px';
    div.style.height = CARD_H + 'px';
    div.style.transform = `translate(${sx}px, ${sy}px)`;
    div.style.zIndex = 10 + i;
    div.classList.remove('carta-oculta');
    div.classList.add('carta-crupier');
  });

  if (state.cartaOcultaIdx !== null) {
    const div = refs.cartasDOM[state.cartaOcultaIdx];
    const sx = cx + state.manoCrupier.length * (CARD_W + GAP);
    div.style.width = CARD_W + 'px';
    div.style.height = CARD_H + 'px';
    div.style.transform = `translate(${sx}px, 90px)`;
    div.style.zIndex = 10 + state.manoCrupier.length;
    div.classList.add('carta-oculta');
    div.classList.add('carta-crupier');
  }

  actualizarPuntuacionCrupier(true);
}

export function revelarCartaOculta() {
  if (state.cartaOcultaIdx === null) return;
  const div = refs.cartasDOM[state.cartaOcultaIdx];
  div.classList.remove('carta-oculta');
  actualizarPuntuacionCrupier(false);
}

export function posicionarNuevasCrupier() {
  const zonaRect = refs.zona.getBoundingClientRect();
  const CARD_W = 120, CARD_H = 165, GAP = 30;
  const todas = [...state.manoCrupier];
  if (state.cartaOcultaIdx !== null) todas.push(state.cartaOcultaIdx);
  const totalW = todas.length * (CARD_W + GAP) - GAP;
  const cx = Math.round((zonaRect.width - totalW) / 2);

  todas.forEach((idx, i) => {
    const div = refs.cartasDOM[idx];
    const sx = cx + i * (CARD_W + GAP);
    const sy = 90;
    div.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    div.style.width = CARD_W + 'px';
    div.style.height = CARD_H + 'px';
    div.style.transform = `translate(${sx}px, ${sy}px)`;
    div.style.zIndex = 10 + i;
    div.classList.add('carta-crupier');
  });
}

// --- CARTAS EXTRA ---

export function posicionarExtra() {
  const zonaRect = refs.zona.getBoundingClientRect();

  let maxRight = 0;
  let slotTop = 0;
  for (const slot of refs.slots) {
    const r = slot.getBoundingClientRect();
    const rx = r.left - zonaRect.left + r.width;
    if (rx > maxRight) {
      maxRight = rx;
      slotTop = r.top - zonaRect.top;
    }
  }

  state.cartasExtra.forEach((idx, i) => {
    const div = refs.cartasDOM[idx];
    const sx = maxRight + 12 + i * 90;
    const sy = slotTop;
    div.style.width = '80px';
    div.style.height = '110px';
    div.style.transform = `translate(${sx}px, ${sy}px)`;
    div.style.zIndex = 20 + i;
    div.classList.remove('carta-oculta');
    div.classList.add('carta-jugador');
  });
}

// --- GRILLA (dev tools) ---

function calcularLayout() {
  const zonaRect = refs.zona.getBoundingClientRect();
  const anchoDisp = zonaRect.width - LABEL_W - 16;
  const altoDisp = zonaRect.height - 16;
  const cols = 15, filas = 4;
  const gapX = 2, gapY = 4;
  const wIdeal = (anchoDisp - (cols - 1) * gapX) / cols;
  const hIdeal = (altoDisp - (filas - 1) * gapY) / filas;

  let w, h;
  if (wIdeal / hIdeal > 80 / 110) {
    h = Math.min(hIdeal, 120);
    w = Math.round(h * 80 / 110);
  } else {
    w = Math.min(wIdeal, 90);
    h = Math.round(w * 110 / 80);
  }
  w = Math.max(w, 60);
  h = Math.max(h, 82);

  const totalW = cols * w + (cols - 1) * gapX;
  const totalH = filas * h + (filas - 1) * gapY;
  const offsetX = Math.round((zonaRect.width - totalW - LABEL_W) / 2 + LABEL_W);
  const offsetY = Math.round((zonaRect.height - totalH) / 2);
  return { w, h, gapX, gapY, offsetX, offsetY };
}

export function desplegarGrilla() {
  const layout = calcularLayout();
  state.ultimoLayout = layout;

  refs.cartasDOM.forEach((div, idxDOM) => {
    if (state.cartasDescartadas.has(idxDOM)) return;
    if (state.manoCrupier.includes(idxDOM)) return;
    if (idxDOM === state.cartaOcultaIdx) return;
    if (state.cartasExtra.includes(idxDOM)) return;

    const posEnOrden = state.ordenActual.indexOf(idxDOM);
    const fila = Math.floor(posEnOrden / 15);
    const col = posEnOrden % 15;

    const px = layout.offsetX + col * (layout.w + layout.gapX);
    const py = layout.offsetY + fila * (layout.h + layout.gapY);

    div.style.width = layout.w + 'px';
    div.style.height = layout.h + 'px';
    div.style.transform = `translate(${px}px, ${py}px)`;
    div.style.zIndex = '';
  });

  refs.labels.forEach(l => {
    l.style.display = 'block';
    const fila = parseInt(l.dataset.fila);
    const y = layout.offsetY + fila * (layout.h + layout.gapY) + layout.h / 2 - 8;
    l.style.transform = `translateY(${y}px)`;
  });

  state.desplegadoEnGrilla = true;
  mostrarPlaceholders(false);
  mostrarDescarte(false);
}

// --- ANIMACIONES ---

export function animarADescarte(div) {
  div.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  div.style.width = '80px';
  div.style.height = '110px';
  div.style.transform = 'translate(12px, 12px)';
  div.style.zIndex = 1;
  div.classList.remove('carta-jugador', 'carta-crupier');

  setTimeout(() => {
    div.style.transition = '';
  }, 550);
}

export function escalarASlot(div, slotIdx) {
  const slot = refs.slots[slotIdx];
  const zonaRect = refs.zona.getBoundingClientRect();
  const slotRect = slot.getBoundingClientRect();
  const sx = slotRect.left - zonaRect.left;
  const sy = slotRect.top - zonaRect.top;

  div.style.transition = 'none';
  div.getBoundingClientRect(); // reflow
  div.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
  div.style.width = slotRect.width + 'px';
  div.style.height = slotRect.height + 'px';
  div.style.transform = `translate(${sx}px, ${sy}px)`;
  div.style.zIndex = '';

  setTimeout(() => { div.style.transition = ''; }, 450);
  div.classList.add('carta-jugador');
}
