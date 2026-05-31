export const PALOS = [
  { simbolo: '\u2660', nombre: 'Espadas', color: '#000' },
  { simbolo: '\u2665', nombre: 'Copas',  color: '#c00' },
  { simbolo: '\u2666', nombre: 'Oros',   color: '#c00' },
  { simbolo: '\u2663', nombre: 'Bastos', color: '#000' },
];

export const ARCANOS = [
  'El Loco',        // 0
  'El Mago',        // 1
  'La Sacerdotisa', // 2
  'La Emperatriz',  // 3
  'El Emperador',   // 4
  'El Sacerdote',   // 5
  'Los Enamorados', // 6
  'El Carro',       // 7
  'La Justicia',    // 8
  'El Ermitaño',    // 9
  'La Rueda',       // 10
  'La Fuerza',      // 11
  'El Colgado',     // 12
  'La Muerte',      // 13
  'La Templanza',   // 14
];

export function crearBaraja() {
  const baraja = [];
  for (const palo of PALOS) {
    for (let valor = 0; valor <= 14; valor++) {
      baraja.push({
        valor,
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
