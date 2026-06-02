// --- WIDGET ITEMS (inventario de fichas) ---

export function crearItems(container) {
  const widget = document.createElement('div');
  Object.assign(widget.style, {
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column', gap: '10px',
    alignItems: 'center', justifyContent: 'flex-start',
    background: '#7a0e0e',
    border: '1px solid #d4a017',
    borderRadius: '6px',
    padding: '14px 8px 8px',
  });

  const label = document.createElement('span');
  label.textContent = 'Items';
  Object.assign(label.style, {
    color: '#ddd', fontSize: '0.85rem', letterSpacing: '0.3em',
    fontWeight: 'bold', padding: '3px 18px',
    border: '1px solid rgba(212, 160, 23, 0.3)',
    borderRadius: '10px', background: 'transparent',
  });

  const puntos = document.createElement('div');
  Object.assign(puntos.style, {
    display: 'flex', flexDirection: 'row', gap: '32px',
    alignItems: 'center', justifyContent: 'center',
    flexWrap: 'wrap',
  });

  for (let i = 0; i < 6; i++) {
    const punto = document.createElement('div');
    Object.assign(punto.style, {
      width: '16px', height: '16px',
      borderRadius: '50%',
      border: '2px solid rgba(212, 160, 23, 0.35)',
      background: 'transparent',
      flexShrink: '0',
    });
    puntos.appendChild(punto);
  }

  widget.appendChild(label);
  widget.appendChild(puntos);
  container.appendChild(widget);
}
