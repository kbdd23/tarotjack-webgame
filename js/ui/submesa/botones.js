// --- BOTONES: botones de juego + panel + devtools ---
//
// Crea btnRepartir, btnNuevaMano, contadorDisplay (en subBottom),
// y btnPedir, btnJugar, btnDescartar (en mesa / refs.btnRow).
// También crea el contenedor de devtools.

import { refs } from '../dom.js';
import { setupPanel } from '../panel.js';

export function crearBotonesJuego(subBottom, mesa) {
  // ── SUB-BOTTOM ──
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

  // ── MESA (btnRow + mesa hijo directo) ──
  const btnDescartar = document.createElement('button');
  btnDescartar.id = 'btn-descartar';
  btnDescartar.textContent = '\u21BB';
  btnDescartar.title = 'Descartar mano';
  refs.btnRow.appendChild(btnDescartar);
  refs.btnDescartar = btnDescartar;

  const btnMasCarta = document.createElement('button');
  btnMasCarta.id = 'btn-mas-carta';
  btnMasCarta.textContent = '+1 CARTA';
  btnMasCarta.title = 'Aumentar mano (dev)';
  mesa.appendChild(btnMasCarta);

  const btnPedir = document.createElement('button');
  btnPedir.id = 'btn-pedir';
  btnPedir.textContent = 'PEDIR';
  btnPedir.title = 'Pedir otra carta';
  btnPedir.disabled = true;
  btnPedir.style.display = 'none';
  mesa.appendChild(btnPedir);
  refs.btnPedir = btnPedir;

  // Colocar +1 CARTA justo antes de PEDIR en el DOM
  mesa.insertBefore(btnMasCarta, btnPedir);

  const btnJugar = document.createElement('button');
  btnJugar.id = 'btn-jugar';
  btnJugar.textContent = 'JUGAR';
  btnJugar.title = 'Plantarse';
  btnJugar.disabled = true;
  refs.btnRow.appendChild(btnJugar);
  refs.btnJugar = btnJugar;

  // ── PANEL ──
  const panel = setupPanel(btnRepartir, contadorDisplay, btnPedir, btnJugar, btnNuevaMano);

  // ── DEVTOOLS ──
  const devToolsContainer = document.createElement('div');
  devToolsContainer.id = 'dev-tools';

  return {
    btnRepartir, btnPedir, btnJugar, btnNuevaMano, btnMasCarta,
    contadorDisplay, btnDescartar, panel, devToolsContainer,
  };
}
