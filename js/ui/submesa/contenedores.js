// --- CONTENEDORES: esqueleto de mesa-chica ---
//
// Crea la estructura base de la mesa lateral y la inserta en el DOM.
// No puebla los contenedores con botones ni widgets.
//
// Devuelve referencias a los contenedores internos para que los
// módulos widget, overlay y botones los pueblen.

export function crearContenedores(body, mesa) {
  const mesaChica = document.createElement('div');
  mesaChica.id = 'mesa-chica';

  // ── sub-superior (contenedores vacíos: usuario / crupier) ──
  const subTop = document.createElement('div');
  subTop.className = 'sub-seccion sub-superior';

  const subTopTop = document.createElement('div');
  subTopTop.className = 'sub-inner';
  subTopTop.style.gap = '4px';
  subTopTop.style.padding = '4px';
  subTopTop.style.flexDirection = 'row';

  const subTopTopLeft = document.createElement('div');
  Object.assign(subTopTopLeft.style, {
    flex: '1', height: '100%',
    display: 'flex', flexDirection: 'column', gap: '4px',
    overflow: 'visible',
  });

  const subTopTopLeftTop = document.createElement('div');
  Object.assign(subTopTopLeftTop.style, {
    flex: '1', width: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    background: '#7a0e0e',
    border: '1px solid #d4a017',
    borderRadius: '6px',
  });

  const subTopTopLeftBottom = document.createElement('div');
  Object.assign(subTopTopLeftBottom.style, {
    flex: '3', width: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    background: '#7a0e0e',
    border: '1px solid #d4a017',
    borderRadius: '6px',
  });

  subTopTopLeft.appendChild(subTopTopLeftTop);
  subTopTopLeft.appendChild(subTopTopLeftBottom);

  const subTopTopRight = document.createElement('div');
  Object.assign(subTopTopRight.style, {
    flex: '1', height: '100%',
    display: 'flex', flexDirection: 'column', gap: '4px',
    overflow: 'hidden',
  });

  const subTopTopRightTop = document.createElement('div');
  Object.assign(subTopTopRightTop.style, {
    flex: '1', width: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    background: '#7a0e0e',
    border: '1px solid #d4a017',
    borderRadius: '6px',
  });

  const subTopTopRightBottom = document.createElement('div');
  Object.assign(subTopTopRightBottom.style, {
    flex: '1', width: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    background: '#7a0e0e',
    border: '1px solid #d4a017',
    borderRadius: '6px',
  });

  subTopTopRight.appendChild(subTopTopRightTop);
  subTopTopRight.appendChild(subTopTopRightBottom);

  subTopTop.appendChild(subTopTopLeft);
  subTopTop.appendChild(subTopTopRight);
  subTop.appendChild(subTopTop);

  const subTopBottom = document.createElement('div');
  subTopBottom.className = 'sub-inner';
  subTopBottom.style.gap = '4px';
  subTopBottom.style.padding = '4px';

  // Dividido en dos mitades con separación (usuario abajo, enemigo arriba)
  const subTopBottomTop = document.createElement('div');
  Object.assign(subTopBottomTop.style, {
    flex: '1', width: '100%',
    display: 'flex', flexDirection: 'row', gap: '4px',
    overflow: 'hidden',
  });

  const subTopBottomTopLeft = document.createElement('div');
  Object.assign(subTopBottomTopLeft.style, {
    flex: '0 0 auto', width: '100px',
    height: '100%', minHeight: '60px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    border: '1px solid #4a3a5a',
    borderRadius: '6px',
    background: 'rgba(60, 40, 80, 0.15)',
  });

  const subTopBottomTopRight = document.createElement('div');
  Object.assign(subTopBottomTopRight.style, {
    flex: '1', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    background: '#7a0e0e',
    border: '1px solid #d4a017',
    borderRadius: '6px',
  });

  subTopBottomTop.appendChild(subTopBottomTopLeft);
  subTopBottomTop.appendChild(subTopBottomTopRight);

  const subTopBottomBot = document.createElement('div');
  Object.assign(subTopBottomBot.style, {
    flex: '1', width: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    border: '1px solid #4a3a5a',
    borderRadius: '6px',
    background: 'rgba(60, 40, 80, 0.15)',
  });

  subTopBottom.appendChild(subTopBottomTop);
  subTopBottom.appendChild(subTopBottomBot);

  subTop.appendChild(subTopBottom);

  mesaChica.appendChild(subTop);

  // ── sub-middle ──
  const subMiddle = document.createElement('div');
  subMiddle.className = 'sub-middle';

  // mid-left
  const midLeft = document.createElement('div');
  midLeft.className = 'mid-half mid-left';

  const midLeftTop = document.createElement('div');
  midLeftTop.style.display = 'flex';
  midLeftTop.style.flexDirection = 'column';
  midLeftTop.style.flex = '1';
  midLeftTop.style.gap = '6px';
  midLeftTop.style.overflow = 'hidden';

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

  midLeft.appendChild(midLeftTop);
  midLeft.appendChild(midLeftBottom);
  subMiddle.appendChild(midLeft);

  // mid-right
  const midRight = document.createElement('div');
  midRight.className = 'mid-half mid-right';

  const midRightTop = document.createElement('div');
  midRightTop.className = 'mid-half-inner';
  midRightTop.style.background = '#7a0e0e';
  midRightTop.style.border = '1px solid #d4a017';
  midRightTop.style.borderRadius = '6px';
  midRightTop.style.padding = '10px';
  midRightTop.style.gap = '8px';

  const midRightBottom = document.createElement('div');
  midRightBottom.className = 'mid-half-inner';
  midRightBottom.style.background = '#7a0e0e';
  midRightBottom.style.border = '1px solid #d4a017';
  midRightBottom.style.borderRadius = '6px';
  midRightBottom.style.padding = '10px';
  midRightBottom.style.gap = '8px';

  midRight.appendChild(midRightTop);
  midRight.appendChild(midRightBottom);
  subMiddle.appendChild(midRight);
  mesaChica.appendChild(subMiddle);

  // ── sub-bottom ──
  const subBottom = document.createElement('div');
  subBottom.className = 'sub-seccion sub-bottom';
  mesaChica.appendChild(subBottom);

  // ── insertar ──
  body.insertBefore(mesaChica, mesa);

  return {
    subTopTop,
    subTopTopLeft,
    subTopTopLeftTop,
    subTopTopLeftBottom,
    subTopTopRight,
    subTopTopRightTop,
    subTopTopRightBottom,
    subTopBottom,
    subTopBottomTop,
    subTopBottomTopLeft,
    subTopBottomTopRight,
    subTopBottomBot,
    midLeftTop,
    midLeftBottom,
    midRightTop,
    midRightBottom,
    subBottom,
  };
}
