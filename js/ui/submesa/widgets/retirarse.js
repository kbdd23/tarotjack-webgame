// --- WIDGET RETIRARSE ---

export function crearRetirarseBtn() {
  const inner = document.createElement('div');
  inner.className = 'sub-inner';

  const btn = document.createElement('button');
  btn.textContent = 'RETIRARSE';
  Object.assign(btn.style, {
    width: '100%', height: '100%',
    background: '#1a2a4a', border: '1px solid #d4a017',
    borderRadius: '8px', color: '#e0eef8',
    fontSize: '1rem', letterSpacing: '0.3em',
    fontWeight: 'bold', cursor: 'pointer',
    fontFamily: "'Courier New', Courier, monospace",
    transition: 'background 0.2s, color 0.2s',
  });
  btn.addEventListener('mouseenter', () => {
    btn.style.background = '#2a3a5a'; btn.style.color = '#fff';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = '#1a2a4a'; btn.style.color = '#e0eef8';
  });

  inner.appendChild(btn);
  return inner;
}
