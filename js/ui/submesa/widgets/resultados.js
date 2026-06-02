// --- WIDGET RESULTADOS (puntos por ronda) ---

export function crearResultados(container) {
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
  label.textContent = 'Puntos';
  Object.assign(label.style, {
    color: '#ddd', fontSize: '0.85rem', letterSpacing: '0.3em',
    fontWeight: 'bold', padding: '3px 18px',
    border: '1px solid rgba(212, 160, 23, 0.3)',
    borderRadius: '10px', background: 'transparent',
  });

  const puntos = document.createElement('div');
  Object.assign(puntos.style, {
    display: 'flex', flexDirection: 'row', gap: '14px',
    alignItems: 'center', justifyContent: 'center',
  });

  const slots = [];
  for (let i = 0; i < 5; i++) {
    const dot = document.createElement('div');
    Object.assign(dot.style, {
      width: '20px', height: '20px',
      borderRadius: '50%',
      border: '2px solid rgba(212, 160, 23, 0.35)',
      background: 'transparent',
      transition: 'background 0.3s',
      flexShrink: '0',
    });
    slots.push(dot);
    puntos.appendChild(dot);
  }

  function dibujar(historial) {
    for (let i = 0; i < 5; i++) {
      if (i < historial.length) {
        const res = historial[i];
        if (res === 'ganaste')      slots[i].style.background = '#27ae60';
        else if (res === 'perdiste') slots[i].style.background = '#d53a3a';
        else                         slots[i].style.background = '#888';
      } else {
        slots[i].style.background = 'transparent';
      }
    }
  }

  widget.appendChild(label);
  widget.appendChild(puntos);
  container.appendChild(widget);

  return { dibujar };
}
