// --- BARREL: orquestador de submesa ---
//
// Reúne contenedores, widgets, overlays y botones.
// Devuelve las referencias que main.js necesita para el wiring.

import { crearContenedores } from './contenedores.js';
import { crearOverlay, crearOverlayPersonaje, crearOverlayCrupier } from './overlays.js';
import { crearWidgets } from './widgets/barrel.js';
import { crearBotonesJuego } from './botones.js';

export function crearSubmesa(body, mesa) {
  const cont = crearContenedores(body, mesa);
  const { overlay, panelOpc } = crearOverlay(body, cont.midLeftTop);
  const personajeOverlay = crearOverlayPersonaje(body);
  const crupierOverlay = crearOverlayCrupier(body);
  const { retirarseBtn } = crearWidgets(cont, personajeOverlay, crupierOverlay);
  const {
    btnRepartir, btnPedir, btnJugar, btnNuevaMano,
    contadorDisplay, btnDescartar, panel, devToolsContainer,
  } = crearBotonesJuego(cont.subBottom, mesa);

  return {
    subTopTop: cont.subTopTop,
    subTopTopLeft: cont.subTopTopLeft,
    subTopTopLeftTop: cont.subTopTopLeftTop,
    subTopTopLeftBottom: cont.subTopTopLeftBottom,
    subTopTopRight: cont.subTopTopRight,
    subTopTopRightTop: cont.subTopTopRightTop,
    subTopTopRightBottom: cont.subTopTopRightBottom,
    subTopBottom: cont.subTopBottom,
    subTopBottomTop: cont.subTopBottomTop,
    subTopBottomTopLeft: cont.subTopBottomTopLeft,
    subTopBottomTopRight: cont.subTopBottomTopRight,
    subTopBottomBot: cont.subTopBottomBot,
    overlay,
    panelOpc,
    btnRepartir,
    btnPedir,
    btnJugar,
    btnNuevaMano,
    contadorDisplay,
    btnDescartar,
    retirarseBtn,
    panel,
    devToolsContainer,
  };
}
