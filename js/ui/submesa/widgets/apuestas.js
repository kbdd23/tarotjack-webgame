// --- WIDGET APUESTAS (HP del crupier) ---

export function crearApuestas(container) {
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
  label.textContent = 'Apuestas';
  Object.assign(label.style, {
    color: '#ddd', fontSize: '0.75rem', letterSpacing: '0.3em',
    fontWeight: 'bold', padding: '2px 14px',
    border: '1px solid rgba(212, 160, 23, 0.3)',
    borderRadius: '10px', background: 'transparent',
  });

  const hp = document.createElement('div');
  hp.textContent = '3';
  Object.assign(hp.style, {
    flex: '1', display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: '#ddd',
    fontSize: '2.2rem', fontWeight: 'bold',
  });

  widget.appendChild(label);
  widget.appendChild(hp);
  container.appendChild(widget);

  function setHp(val) {
    hp.textContent = String(val);
  }

  return { setHp };
}
