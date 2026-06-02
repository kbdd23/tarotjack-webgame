// --- BARAJA TAROT (60 cartas: 4 palos españoles × 15 arcanos) ---

export const PALOS = [
  { simbolo: '\u2660', nombre: 'Espadas', color: '#000' },
  { simbolo: '\u2665', nombre: 'Copas',  color: '#c00' },
  { simbolo: '\u2666', nombre: 'Oros',   color: '#c00' },
  { simbolo: '\u2663', nombre: 'Bastos', color: '#000' },
];

export const ARCANOS = [
  'El Loco',
  'El Mago',
  'La Sacerdotisa',
  'La Emperatriz',
  'El Emperador',
  'El Sacerdote',
  'Los Enamorados',
  'El Carro',
  'La Justicia',
  'El Ermitaño',
  'La Rueda',
  'La Fuerza',
  'El Colgado',
  'La Muerte',
  'La Templanza',
];

export function crearBaraja() {
  const baraja = [];
  for (const palo of PALOS) {
    for (let valor = 0; valor <= 14; valor++) {
      baraja.push({
        valor,
        display: valor === 0 ? '0' : String(valor),
        palo: palo.simbolo,
        paloNombre: palo.nombre,
        color: palo.color,
        arcano: ARCANOS[valor],
        puntosBlackjack: valor === 0 ? [0, 11] : [valor],
      });
    }
  }
  return baraja;
}
