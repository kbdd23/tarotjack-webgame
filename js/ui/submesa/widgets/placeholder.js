// --- WIDGET PLACEHOLDER ---

export function crearPlaceholder(container) {
  const widget = document.createElement('div');
  Object.assign(widget.style, {
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#7a0e0e',
    border: '1px solid #d4a017',
    borderRadius: '6px',
  });

  const label = document.createElement('span');
  label.textContent = 'PLACEHOLDER';
  Object.assign(label.style, {
    color: 'rgba(212, 160, 23, 0.4)',
    fontSize: '0.9rem', letterSpacing: '0.4em',
    fontWeight: 'bold', fontStyle: 'italic',
  });

  widget.appendChild(label);
  container.appendChild(widget);
}
