// --- BARAJA BLACKJACK (52 cartas: 4 palos franceses × 13 valores) ---

export const PALOS_FRANCESES = [
  { simbolo: '\u2660', nombre: 'Picas',      color: '#000' },
  { simbolo: '\u2665', nombre: 'Corazones',  color: '#c00' },
  { simbolo: '\u2666', nombre: 'Diamantes',  color: '#c00' },
  { simbolo: '\u2663', nombre: 'Tréboles',   color: '#000' },
];

export const NOMBRES_BLACKJACK = [
  'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
];

export function crearBarajaBlackjack() {
  const baraja = [];
  for (const palo of PALOS_FRANCESES) {
    for (let i = 0; i < 13; i++) {
      let valor, pts;
      if (i === 0) {
        valor = 1;
        pts = [1, 11];
      } else if (i >= 10) {
        valor = 10;
        pts = [10];
      } else {
        valor = i + 1;
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
