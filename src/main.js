const readline = require('readline');
const {
  seleccionarPalabraAleatoria,
  contieneLetra,
  esPalabraCorrecta,
  mostrarProgreso
} = require('./game');

// Diccionario de palabras
const diccionario = ['javascript', 'react', 'angular', 'node', 'express'];

// Palabra secreta
let palabraSecreta = seleccionarPalabraAleatoria(diccionario);
let letrasAdivinadas = [];
let intentosRestantes = 6;
const restart_token = '***';

// Interfaz de entrada por consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para mostrar estado del juego
function mostrarEstado() {
  console.log('\nPalabra: ', mostrarProgreso(palabraSecreta, letrasAdivinadas));
  console.log('Letras usadas:', letrasAdivinadas.join(' '));
  console.log('Intentos restantes:', intentosRestantes);
}

function restart() {
  intentosRestantes = 6;
  palabraSecreta = seleccionarPalabraAleatoria(diccionario);
  letrasAdivinadas = [];
}

// Función principal del juego
function jugar() {
  if (intentosRestantes <= 0) {
    console.log('\n¡Perdiste! La palabra era:', palabraSecreta);
    rl.close();
    return;
  }

  if (mostrarProgreso(palabraSecreta, letrasAdivinadas).replace(/ /g, '') === palabraSecreta) {
    console.log('\n¡Ganaste! La palabra era:', palabraSecreta);
    rl.close();
    return;
  }

  mostrarEstado();
  rl.question('Ingresá una letra o la palabra completa: ', (entrada) => {
    const intento = entrada.trim().toLowerCase();
    if (intento === restart_token) {
        console.log('Reiniciando el juego...');
        restart();
        jugar();
        return;
    }
    if (intento.length > 1) {
      if (esPalabraCorrecta(palabraSecreta, intento)) {
        console.log('\n¡Ganaste! Adivinaste la palabra completa.');
        rl.close();
      } else {
        console.log('Palabra incorrecta.');
        intentosRestantes--;
        jugar();
      }
    } else if (intento.length === 1) {
      if (letrasAdivinadas.includes(intento)) {
        console.log('Ya ingresaste esa letra.');
      } else if (contieneLetra(palabraSecreta, intento)) {
        console.log('¡Letra correcta!');
        letrasAdivinadas.push(intento);
      } else {
        console.log('Letra incorrecta.');
        letrasAdivinadas.push(intento);
        intentosRestantes--;
      }
      jugar();
    } else {
      console.log('Entrada inválida.');
      jugar();
    }
  });
}

// Iniciar el juego
console.log('\n🎮 ¡Bienvenido al juego del Ahorcado! 🎮');
jugar();
