// --- WIDGET CRUPIER (rótulo de sección) ---

export function crearCrupier(container) {
  const widget = document.createElement('div');
  Object.assign(widget.style, {
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#7a0e0e',
    border: '1px solid #d4a017',
    borderRadius: '6px',
  });

  const label = document.createElement('span');
  label.textContent = 'CRUPIER';
  Object.assign(label.style, {
    color: '#ddd', fontSize: '1.2rem', letterSpacing: '0.5em',
    fontWeight: 'bold',
  });

  widget.appendChild(label);
  container.appendChild(widget);
}
