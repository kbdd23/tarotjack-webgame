import { state, BOSSES } from '../../../core/state.js';

// --- WIDGET IMAGEN CRUPIER ---

export function crearCrupierImg(container, crupierOverlay) {
  const boss = BOSSES[state.bossActual];

  const widget = document.createElement('div');
  Object.assign(widget.style, {
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
    background: '#7a0e0e',
    border: '1px solid #d4a017',
    borderRadius: '6px',
    overflow: 'visible',
    padding: '0',
  });

  const label = document.createElement('span');
  label.textContent = boss.nombre;
  Object.assign(label.style, {
    color: '#ddd', fontSize: '0.8rem', letterSpacing: '0.2em',
    fontWeight: 'bold', textDecoration: 'underline',
    textUnderlineOffset: '3px',
    cursor: 'pointer',
    padding: '4px 10px',
    transition: 'color 0.2s',
    zIndex: '1',
  });
  label.addEventListener('mouseenter', () => { label.style.color = '#fff'; });
  label.addEventListener('mouseleave', () => { label.style.color = '#ddd'; });

  const img = document.createElement('img');
  img.src = `assets/crupiers/${boss.archivo}`;
  img.alt = 'Crupier';
  Object.assign(img.style, {
    maxWidth: '80%',
    height: '90%',
    objectFit: 'contain',
    display: 'block',
    marginBottom: '-15px',
  });

  widget.appendChild(label);
  widget.appendChild(img);
  container.appendChild(widget);

  if (crupierOverlay) {
    label.addEventListener('click', crupierOverlay.mostrarOverlay);
    crupierOverlay.conectarCrupier(img, label);
  }

  function temblar() {
    widget.style.animation = 'none';
    void widget.offsetWidth;
    widget.style.animation = 'shake 0.35s';
    setTimeout(() => { widget.style.animation = ''; }, 400);
  }

  function setBoss(bossData) {
    img.src = `assets/crupiers/${bossData.archivo}`;
    img.alt = bossData.nombre;
    label.textContent = bossData.nombre;
  }

  return { temblar, setBoss };
}
