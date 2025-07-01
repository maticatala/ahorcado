const { Given, When, Then, Before } = require("@cucumber/cucumber");
const { expect } = require("chai");

// Estado simulado del juego
const gameState = {
  palabraSecreta: "",
  letrasAdivinadas: [],
  intentosRestantes: 6,
  mensaje: "",
  juegoTerminado: false,
  inputDeshabilitado: false,
};

// Resetea el estado antes de cada escenario
Before(() => {
  gameState.palabraSecreta = "";
  gameState.letrasAdivinadas = [];
  gameState.intentosRestantes = 6;
  gameState.mensaje = "";
  gameState.juegoTerminado = false;
  gameState.inputDeshabilitado = false;
});

function simularInicioJuego(palabra) {
  gameState.palabraSecreta = palabra;
  gameState.letrasAdivinadas = [];
  gameState.intentosRestantes = 6;
  gameState.mensaje = "";
  gameState.juegoTerminado = false;
  gameState.inputDeshabilitado = false;
}

function simularIngresoLetra(letra) {
  if (gameState.juegoTerminado) return;

  const palabraContieneLetra = gameState.palabraSecreta.toLowerCase().includes(letra.toLowerCase());

  if (gameState.letrasAdivinadas.includes(letra.toLowerCase())) {
    gameState.mensaje = "Ya ingresaste esa letra.";
    return;
  }

  gameState.letrasAdivinadas.push(letra.toLowerCase());

  if (palabraContieneLetra) {
    gameState.mensaje = "¡Letra correcta!";
    const todasLasLetrasAdivinadas = gameState.palabraSecreta
      .toLowerCase()
      .split("")
      .every((letra) => gameState.letrasAdivinadas.includes(letra));

    if (todasLasLetrasAdivinadas) {
      gameState.mensaje = "¡Ganaste! ¡Felicitaciones!";
      gameState.juegoTerminado = true;
      gameState.inputDeshabilitado = true;
    }
  } else {
    gameState.mensaje = "Letra incorrecta.";
    gameState.intentosRestantes--;
    if (gameState.intentosRestantes <= 0) {
      gameState.mensaje = `¡Perdiste! La palabra era: ${gameState.palabraSecreta.toUpperCase()}`;
      gameState.juegoTerminado = true;
      gameState.inputDeshabilitado = true;
    }
  }
}

function obtenerProgresoPalabra() {
  return gameState.palabraSecreta
    .split("")
    .map((letra) =>
      gameState.letrasAdivinadas.includes(letra.toLowerCase()) ? letra : "_"
    )
    .join(" ");
}

function simularAdivinanzaMultiplesLetras(letras) {
  letras.forEach((letra) => {
    if (!gameState.juegoTerminado) {
      simularIngresoLetra(letra);
    }
  });
}

// === PASOS DEFINIDOS ===

// Antecedentes
Given("que el juego del ahorcado está iniciado", () => {
  expect(true).to.be.true;
});

Given("la palabra secreta es {string}", (palabra) => {
  simularInicioJuego(palabra);
  expect(gameState.palabraSecreta).to.equal(palabra);
});

Given("tengo {int} intentos restantes", (intentos) => {
  gameState.intentosRestantes = intentos;
  expect(gameState.intentosRestantes).to.equal(intentos);
});

Given("no he adivinado ninguna letra", () => {
  gameState.letrasAdivinadas = [];
  expect(gameState.letrasAdivinadas).to.have.lengthOf(0);
});

// Escenario 1
Given("que la palabra secreta contiene la letra {string}", (letra) => {
  expect(gameState.palabraSecreta.toLowerCase()).to.include(letra.toLowerCase());
});

When("ingreso la letra {string}", (letra) => {
  simularIngresoLetra(letra);
});

Then("el progreso de la palabra se actualiza mostrando la letra {string}", (letra) => {
  const progreso = obtenerProgresoPalabra();
  expect(progreso).to.include(letra);
});

Then("los intentos restantes siguen siendo {int}", (intentos) => {
  expect(gameState.intentosRestantes).to.equal(intentos);
});

Then("la letra {string} aparece en la lista de letras usadas", (letra) => {
  expect(gameState.letrasAdivinadas).to.include(letra.toLowerCase());
});

Then("veo el mensaje {string}", (mensaje) => {
  expect(gameState.mensaje).to.equal(mensaje);
});

// Escenario 2
Given("que la palabra secreta no contiene la letra {string}", (letra) => {
  expect(gameState.palabraSecreta.toLowerCase()).to.not.include(letra.toLowerCase());
});

Then("el progreso de la palabra no cambia", () => {
  const progreso = obtenerProgresoPalabra();
  const esperado = gameState.palabraSecreta.split("").map(() => "_").join(" ");
  expect(progreso).to.equal(esperado);
});

Then("los intentos restantes se reducen a {int}", (intentos) => {
  expect(gameState.intentosRestantes).to.equal(intentos);
});

Then("aparece una parte del dibujo del ahorcado", () => {
  const partesVisibles = 6 - gameState.intentosRestantes;
  expect(partesVisibles).to.be.greaterThan(0);
});

// Escenario 3
Given(
  "que he adivinado las letras {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}",
  (...letras) => {
    simularAdivinanzaMultiplesLetras(letras);
  }
);

When("el progreso muestra la palabra completa", () => {
  const progreso = obtenerProgresoPalabra();
  expect(progreso.replace(/ /g, "")).to.equal(gameState.palabraSecreta);
});

Then("el campo de entrada se deshabilita", () => {
  expect(gameState.inputDeshabilitado).to.be.true;
});

Then("no puedo hacer más intentos", () => {
  expect(gameState.juegoTerminado).to.be.true;
});

Then("la palabra se muestra completamente revelada", () => {
  expect(obtenerProgresoPalabra()).to.not.include("_");
});

// Escenario 4
Given("que he hecho {int} intentos incorrectos", (n) => {
  const letras = "zqxwkj";
  for (let i = 0; i < n; i++) {
    simularIngresoLetra(letras[i]);
  }
});

Given("me queda {int} intento restante", (restantes) => {
  expect(gameState.intentosRestantes).to.equal(restantes);
});

When("ingreso una letra incorrecta {string}", (letra) => {
  simularIngresoLetra(letra);
});

Then("los intentos restantes llegan a {int}", (intentos) => {
  expect(gameState.intentosRestantes).to.equal(intentos);
});

Then("el dibujo del ahorcado está completo", () => {
  expect(gameState.intentosRestantes).to.equal(0);
});
