// --- WIDGET TIENDA ---

export function crearTienda(container) {
  const label = document.createElement('span');
  label.textContent = 'TIENDA';
  Object.assign(label.style, {
    color: '#ddd', fontSize: '0.75rem', letterSpacing: '0.3em',
    fontWeight: 'bold', padding: '4px 18px',
    border: '1px solid rgba(212, 160, 23, 0.3)',
    borderRadius: '10px', background: 'transparent',
  });

  const count = document.createElement('div');
  count.textContent = '0';
  Object.assign(count.style, {
    flex: '1', display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: '#ddd',
    fontSize: '2rem', fontWeight: 'bold', cursor: 'pointer',
    transition: 'color 0.2s',
  });
  count.addEventListener('mouseenter', () => { count.style.color = '#fff'; });
  count.addEventListener('mouseleave', () => { count.style.color = '#ddd'; });

  container.appendChild(label);
  container.appendChild(count);
}
