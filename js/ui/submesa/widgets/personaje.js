import { state } from '../../../core/state.js';

// --- WIDGET PERSONAJE (ficha + selector de color) ---

export function crearPersonaje(container, personajeOverlay) {
  const widget = document.createElement('div');
  Object.assign(widget.style, {
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column', gap: '6px',
    alignItems: 'center', justifyContent: 'center',
    background: '#7a0e0e',
    border: '1px solid #d4a017',
    borderRadius: '6px',
    padding: '6px',
  });

  const label = document.createElement('span');
  label.textContent = 'Azul';
  Object.assign(label.style, {
    color: '#ddd', fontSize: '0.75rem', letterSpacing: '0.3em',
    fontWeight: 'bold', padding: '2px 14px',
    border: '1px solid rgba(212, 160, 23, 0.3)',
    borderRadius: '10px', background: 'transparent',
    cursor: 'pointer',
    transition: 'border-color 0.2s, color 0.2s',
  });
  label.addEventListener('mouseenter', () => {
    label.style.borderColor = '#d4a017'; label.style.color = '#fff';
  });
  label.addEventListener('mouseleave', () => {
    label.style.borderColor = 'rgba(212, 160, 23, 0.3)'; label.style.color = '#ddd';
  });

  const ficha = document.createElement('div');
  Object.assign(ficha.style, {
    width: '46px', height: '46px',
    borderRadius: '50%',
    background: '#3a7bd5',
    border: '2px solid rgba(212, 160, 23, 0.5)',
    flexShrink: '0',
  });

  widget.appendChild(label);
  widget.appendChild(ficha);
  container.appendChild(widget);

  // Vibración al cambiar color
  function temblar() {
    widget.style.animation = 'none';
    void widget.offsetWidth;
    widget.style.animation = 'shake 0.3s';
    setTimeout(() => { widget.style.animation = ''; }, 350);
  }

  // Conectar overlay selector de color (solo en espera)
  if (personajeOverlay) {
    label.addEventListener('click', () => {
      if (state.fase === 'esperando') {
        personajeOverlay.mostrarOverlay();
      }
    });
    personajeOverlay.conectarWidget(ficha, label, temblar);
  }
}
