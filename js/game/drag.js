import { state, hayCartasFuera, liberarCarta, slotOcupado } from '../core/state.js';
import { refs } from '../ui/dom.js';
import { posicionarApilado, obtenerPosTransform } from '../ui/layout.js';
import { actualizarPuntuacion } from '../ui/display.js';

const SNAP_THRESHOLD = 70;

let arrastrando = null;

export function iniciarArrastre(e, div) {
  if (state.fase !== 'jugando') return;

  const idx = parseInt(div.dataset.idx);

  if (state.manoCrupier.includes(idx)) return;
  if (idx === state.cartaOcultaIdx) return;
  if (state.cartasExtra.includes(idx)) return;

  for (let s = 0; s < state.maxCartasMano; s++) {
    if (state.slotsOcupados[s] === idx) {
      state.slotsOcupados[s] = null;
      actualizarPuntuacion();
      break;
    }
  }

  if (!hayCartasFuera()) {
    liberarCarta(idx);
    posicionarApilado();
  } else if (!state.cartasLibres.has(idx)) {
    liberarCarta(idx);
  }

  div.style.zIndex = 1000;
  div.style.transition = 'none';

  const pos = obtenerPosTransform(div);
  const zonaRect = refs.zona.getBoundingClientRect();
  const mouseX = e.clientX - zonaRect.left;
  const mouseY = e.clientY - zonaRect.top;

  arrastrando = {
    div,
    offsetX: mouseX - pos.x,
    offsetY: mouseY - pos.y,
  };
}

export function moverArrastre(e) {
  if (!arrastrando) return;

  const zonaRect = refs.zona.getBoundingClientRect();
  const mx = e.clientX - zonaRect.left - arrastrando.offsetX;
  const my = e.clientY - zonaRect.top - arrastrando.offsetY;

  arrastrando.div.style.transform = `translate(${mx}px, ${my}px)`;
}

function detectarSnap(div) {
  const divRect = div.getBoundingClientRect();
  const dcx = divRect.left + divRect.width / 2;
  const dcy = divRect.top + divRect.height / 2;

  const slots = refs.slots;
  if (!slots) return false;

  for (let i = 0; i < state.maxCartasMano; i++) {
    if (state.slotsOcupados[i] !== null) continue;
    if (slots[i].style.display === 'none') continue;

    const slotRect = slots[i].getBoundingClientRect();
    const scx = slotRect.left + slotRect.width / 2;
    const scy = slotRect.top + slotRect.height / 2;

    const dist = Math.sqrt((dcx - scx) ** 2 + (dcy - scy) ** 2);
    if (dist > SNAP_THRESHOLD) continue;

    const zonaRect = refs.zona.getBoundingClientRect();
    const sx = slotRect.left - zonaRect.left;
    const sy = slotRect.top - zonaRect.top;

    div.style.transform = `translate(${sx}px, ${sy}px)`;
    div.style.width = slotRect.width + 'px';
    div.style.height = slotRect.height + 'px';
    div.style.zIndex = '';

    slotOcupado(i, parseInt(div.dataset.idx));
    actualizarPuntuacion();
    return true;
  }

  return false;
}

export function terminarArrastre() {
  if (!arrastrando) return;

  arrastrando.div.style.transition = '';

  if (!detectarSnap(arrastrando.div)) {
    arrastrando.div.style.width = '80px';
    arrastrando.div.style.height = '110px';
  }

  arrastrando = null;
}

export function conectarDrag() {
  refs.cartasDOM.forEach(div => {
    div.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      iniciarArrastre(e, div);
    });
  });

  refs.zona.addEventListener('mousemove', moverArrastre);
  document.addEventListener('mouseup', terminarArrastre);
  refs.zona.addEventListener('dragstart', e => e.preventDefault());
}
