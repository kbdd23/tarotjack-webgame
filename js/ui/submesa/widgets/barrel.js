// --- BARREL DE WIDGETS ---
//
// Orquesta todos los widgets de la submesa.

import { crearRetirarseBtn } from './retirarse.js';
import { crearTienda } from './tienda.js';
import { crearRonda } from './ronda.js';
import { crearDescartes } from './descartes.js';
import { crearPersonaje } from './personaje.js';
import { crearItems } from './items.js';
import { crearApuestas } from './apuestas.js';
import { crearMovimientos } from './movimientos.js';
import { crearCrupier } from './crupier.js';
import { crearCrupierImg } from './crupier-img.js';
import { crearResultados } from './resultados.js';
import { registrarDibujarPuntos, registrarSetHp, registrarTemblarCrupier, registrarSetBoss } from '../../display.js';

export function crearWidgets(containers, personajeOverlay, crupierOverlay) {
  const { midLeftTop, midLeftBottom, midRightTop, midRightBottom, subTopBottomTopLeft, subTopBottomBot, subTopTopRightTop, subTopTopRightBottom, subTopTopLeftTop, subTopTopLeftBottom, subTopBottomTopRight } = containers;

  // midLeftTop: opcionesBtn lo crea overlays.js, retirarse aquí
  const retirarseDiv = crearRetirarseBtn();
  midLeftTop.appendChild(retirarseDiv);

  crearTienda(midLeftBottom);
  crearRonda(midRightTop);
  crearDescartes(midRightBottom);
  crearPersonaje(subTopBottomTopLeft, personajeOverlay);
  crearItems(subTopBottomBot);
  const apuestasWidget = crearApuestas(subTopTopRightTop);
  registrarSetHp(apuestasWidget.setHp);
  crearMovimientos(subTopTopRightBottom);
  crearCrupier(subTopTopLeftTop);
  const cri = crearCrupierImg(subTopTopLeftBottom, crupierOverlay);
  registrarTemblarCrupier(cri.temblar);
  registrarSetBoss(cri.setBoss);
  const resultados = crearResultados(subTopBottomTopRight);
  registrarDibujarPuntos(resultados.dibujar);

  // El barrel retorna solo lo que usa submesa/barrel.js
  // retirarseDiv se necesita afuera como retirarseBtn
  const retirarseBtn = retirarseDiv.querySelector('button');
  return { retirarseBtn };
}
