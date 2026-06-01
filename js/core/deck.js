export const PALOS = [
  { simbolo: '\u2660', nombre: 'Espadas', color: '#000' },
  { simbolo: '\u2665', nombre: 'Copas',  color: '#c00' },
  { simbolo: '\u2666', nombre: 'Oros',   color: '#c00' },
  { simbolo: '\u2663', nombre: 'Bastos', color: '#000' },
];

export const PALOS_FRANCESES = [
  { simbolo: '\u2660', nombre: 'Picas',      color: '#000' },
  { simbolo: '\u2665', nombre: 'Corazones',  color: '#c00' },
  { simbolo: '\u2666', nombre: 'Diamantes',  color: '#c00' },
  { simbolo: '\u2663', nombre: 'Tréboles',   color: '#000' },
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

export const NOMBRES_BLACKJACK = [
  'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
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

export function crearBarajaBlackjack() {
  const baraja = [];
  for (const palo of PALOS_FRANCESES) {
    for (let i = 0; i < 13; i++) {
      let valor, pts;
      if (i === 0) {           // A
        valor = 1;
        pts = [1, 11];
      } else if (i >= 10) {    // J, Q, K
        valor = 10;
        pts = [10];
      } else {
        valor = i + 1;         // 2–10
        pts = [valor];
      }
      baraja.push({
        valor,
        display: NOMBRES_BLACKJACK[i],
        palo: palo.simbolo,
        paloNombre: palo.nombre,
        color: palo.color,
        arcano: NOMBRES_BLACKJACK[i],
        puntosBlackjack: pts,
      });
    }
  }
  return baraja;
}
