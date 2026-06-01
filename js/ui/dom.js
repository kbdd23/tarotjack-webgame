// --- UI: creación de elementos DOM ---

import { state } from '../core/state.js';
import { PALOS } from '../core/deck.js';

export const refs = {
  cartasDOM: [],
  labels: [],
  zona: null,
  zonaMano: null,
  slots: [],
  puntuacionDisplay: null,
  zonaDescarte: null,
  btnDescartar: null,
  recargasDisplay: null,
  descarteDisplay: null,
  btnRow: null,
  zonaExtra: null,
  // --- CRUPIER ---
  zonaCrupier: null,
  puntuacionCrupier: null,
  resultadoDisplay: null,
  // --- BOTONES ---
  btnPedir: null,
  btnJugar: null,
  btnNuevaMano: null,
  rondaDisplay: null,
};

// --- CARTAS ---

export function crearCartas(baraja, zona) {
  refs.zona = zona;
  refs.cartasDOM = [];

  const esBlackjack = baraja.length === 52;

  for (let i = 0; i < baraja.length; i++) {
    const div = document.createElement('div');
    div.className = 'carta';
    div.dataset.idx = i;

    const carta = baraja[i];
    const valorStr = carta.display;
    const paloChico = esBlackjack ? `<span class="carta-palo-chico">${carta.palo}</span>` : '';
    const esquinaAbajo = esBlackjack
      ? `<div class="carta-esquina abajo"><span class="carta-numero">${valorStr}</span>${paloChico}</div>`
      : `<div class="carta-esquina abajo"><span class="carta-numero">${valorStr}</span></div>`;

    div.innerHTML = `
      <div class="carta-esquina">
        <span class="carta-numero">${valorStr}</span>
        ${paloChico}
      </div>
      <div class="carta-centro">
        <span class="carta-palo">${carta.palo}</span>
        <span class="carta-arcano">${carta.arcano}</span>
      </div>
      ${esquinaAbajo}
    `;

    zona.appendChild(div);
    refs.cartasDOM.push(div);
  }

  // Asignar color del palo (negro/rojo) a cada carta para que herede a número y palo
  // Solo para blackjack (52 cartas) — tarot usa colores fijos del CSS (#ccc / #aaa)
  if (esBlackjack) {
    refs.cartasDOM.forEach((div, i) => {
      div.style.color = baraja[i].color;
    });
  }
}

/** Recrea las cartas del DOM a partir de una nueva baraja.
 *  Limpia la zona de cartas, remueve los divs viejos y crea nuevos.
 *  @param {'tarot'|'blackjack'} tipo — para blackjack asigna color inline (herencia CSS) */
export function refrescarCartas(baraja, tipo) {
  // Remover divs viejos
  for (const div of refs.cartasDOM) {
    div.remove();
  }
  refs.cartasDOM = [];

  // Recrear con la baraja actual
  const esBlackjack = tipo === 'blackjack';

  for (let i = 0; i < baraja.length; i++) {
    const div = document.createElement('div');
    div.className = 'carta';
    div.dataset.idx = i;

    const carta = baraja[i];
    const valorStr = carta.display;
    const paloChico = esBlackjack ? `<span class="carta-palo-chico">${carta.palo}</span>` : '';
    const esquinaAbajo = esBlackjack
      ? `<div class="carta-esquina abajo"><span class="carta-numero">${valorStr}</span>${paloChico}</div>`
      : `<div class="carta-esquina abajo"><span class="carta-numero">${valorStr}</span></div>`;

    // En blackjack, el color del texto sigue al palo (negro/rojo)
    if (esBlackjack) div.style.color = carta.color;

    div.innerHTML = `
      <div class="carta-esquina">
        <span class="carta-numero">${valorStr}</span>
        ${paloChico}
      </div>
      <div class="carta-centro">
        <span class="carta-palo">${carta.palo}</span>
        <span class="carta-arcano">${carta.arcano}</span>
      </div>
      ${esquinaAbajo}`;

    refs.zona.appendChild(div);
    refs.cartasDOM.push(div);
  }
}

// --- LABELS ---

export function crearLabels(zona) {
  refs.labels = [];
  for (let p = 0; p < 4; p++) {
    const label = document.createElement('div');
    label.className = 'palo-label';
    label.textContent = PALOS[p].simbolo;
    label.dataset.fila = p;
    zona.appendChild(label);
    refs.labels.push(label);
  }
}

// --- ZONA DE DESCARTA ---

export function crearZonaDescarte(zona) {
  const zonaDesc = document.createElement('div');
  zonaDesc.id = 'zona-descarte';
  zonaDesc.textContent = 'D';
  zona.appendChild(zonaDesc);
  refs.zonaDescarte = zonaDesc;
}

// --- ZONA CRUPIER ---

export function crearZonaCrupier(zona) {
  const zonaCrup = document.createElement('div');
  zonaCrup.id = 'zona-crupier';
  zona.appendChild(zonaCrup);
  refs.zonaCrupier = zonaCrup;
}

// --- RESULTADO ---

export function crearResultadoDisplay(zona) {
  const div = document.createElement('div');
  div.id = 'resultado-partida';
  zona.appendChild(div);
  refs.resultadoDisplay = div;
}

// --- PLACEHOLDERS (mano del jugador) ---

export function crearPlaceholders(zona) {
  const zonaMano = document.createElement('div');
  zonaMano.id = 'zona-mano';

  const puntuacion = document.createElement('div');
  puntuacion.id = 'puntuacion-mano';
  puntuacion.textContent = '0 / 21';
  zonaMano.appendChild(puntuacion);

  const filaSlots = document.createElement('div');
  filaSlots.className = 'slots-fila';

  for (let i = 0; i < 5; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot-mano';
    slot.dataset.slot = i;
    slot.style.display = i < 2 ? '' : 'none';
    filaSlots.appendChild(slot);
  }

  zonaMano.appendChild(filaSlots);

  const btnRow = document.createElement('div');
  btnRow.className = 'btn-row';

  const recargasSpan = document.createElement('span');
  recargasSpan.className = 'recargas-counter';
  recargasSpan.textContent = '3';
  btnRow.appendChild(recargasSpan);
  refs.recargasDisplay = recargasSpan;

  zonaMano.appendChild(btnRow);
  refs.btnRow = btnRow;

  zona.appendChild(zonaMano);

  refs.zonaMano = zonaMano;
  refs.slots = filaSlots.querySelectorAll('.slot-mano');
  refs.puntuacionDisplay = puntuacion;

  // Zona para cartas extra (hit)
  const zonaExtra = document.createElement('div');
  zonaExtra.id = 'zona-extra';
  zonaMano.appendChild(zonaExtra);
  refs.zonaExtra = zonaExtra;
}
