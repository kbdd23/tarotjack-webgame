// --- PANEL: estado visual de los botones de juego ---
//
// Responsabilidad: traducir la fase del juego en visibilidad y estado
// de los botones del panel del jugador.
//
// No depende de state.js — recibe valores concretos (count, max) y los renderiza.

export function setupPanel(btnRepartir, contadorDisplay, btnPedir, btnJugar, btnNuevaMano) {
  return {
    /** Oculta los botones de juego activo (pedir, jugar, nueva-mano) */
    ocultarJuego: () => {
      btnPedir.style.display = 'none';
      btnJugar.disabled = true;
      btnNuevaMano.style.display = 'none';
    },

    /** Muestra pedir + jugar, oculta repartir, muestra el contador */
    mostrarJuego: () => {
      btnPedir.style.display = '';
      btnPedir.disabled = false;
      btnJugar.disabled = false;
      btnNuevaMano.style.display = 'none';
      btnRepartir.style.display = 'none';
      contadorDisplay.style.display = '';
    },

    /** Solo deja visible el botón de nueva mano */
    mostrarNuevaMano: () => {
      btnPedir.style.display = 'none';
      btnJugar.disabled = true;
      btnRepartir.style.display = 'none';
      contadorDisplay.style.display = 'none';
      btnNuevaMano.style.display = '';
    },

    /** Vuelve al estado inicial: repartir visible, todo lo demás oculto */
    mostrarRepartir: () => {
      btnPedir.style.display = 'none';
      btnJugar.disabled = true;
      btnNuevaMano.style.display = 'none';
      btnRepartir.style.display = '';
      btnRepartir.disabled = false;
      contadorDisplay.style.display = 'none';
    },

    /** Actualiza el texto del contador: "count/max" */
    actualizarContador: (count, max) => {
      contadorDisplay.textContent = `${count}/${max}`;
    },
  };
}
