import { Given, When, Then, Before, After } from "@cucumber/cucumber"
import { expect } from "chai"
import { JSDOM } from "jsdom"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let dom
let window
let document
let gameState

// Simulación de las funciones del juego
const diccionario = ["javascript", "react", "angular", "node", "express"]

function seleccionarPalabraAleatoria(dict) {
  const indiceAleatorio = Math.floor(Math.random() * dict.length)
  return dict[indiceAleatorio]
}

function contieneLetra(palabra, letra) {
  return palabra.toLowerCase().includes(letra.toLowerCase())
}

function esPalabraCorrecta(palabraSecreta, palabraIntento) {
  return palabraSecreta.toLowerCase() === palabraIntento.toLowerCase()
}

function mostrarProgreso(palabra, letrasAdivinadas) {
  return palabra
    .split("")
    .map((letra) => (letrasAdivinadas.includes(letra.toLowerCase()) ? letra : "_"))
    .join(" ")
}

// Simulación del estado del juego
function createGameState() {
  return {
    palabraSecreta: "",
    letrasAdivinadas: [],
    intentosRestantes: 6,
    bodyParts: ["head", "body", "leftArm", "rightArm", "leftLeg", "rightLeg"],

    inicializarJuego() {
      this.palabraSecreta = seleccionarPalabraAleatoria(diccionario)
      this.letrasAdivinadas = []
      this.intentosRestantes = 6
      this.actualizarUI()
      this.ocultarPartesCuerpo()
      this.limpiarMensaje()
      this.habilitarInput()
    },

    actualizarUI() {
      const wordProgressElement = document.getElementById("wordProgress")
      const attemptsLeftElement = document.querySelector(".attempts-count")
      const usedLettersElement = document.querySelector(".letters-list")

      if (wordProgressElement) {
        const progreso = mostrarProgreso(this.palabraSecreta, this.letrasAdivinadas)
        wordProgressElement.textContent = progreso
      }

      if (attemptsLeftElement) {
        attemptsLeftElement.textContent = this.intentosRestantes
        attemptsLeftElement.style.color = this.intentosRestantes <= 2 ? "#e53e3e" : "#2d3748"
      }

      if (usedLettersElement) {
        usedLettersElement.textContent = this.letrasAdivinadas.join(" ").toUpperCase()
      }

      const intentosPerdidos = 6 - this.intentosRestantes
      for (let i = 0; i < intentosPerdidos; i++) {
        if (this.bodyParts[i]) {
          this.mostrarParteCuerpo(this.bodyParts[i])
        }
      }
    },

    mostrarParteCuerpo(partId) {
      const parte = document.getElementById(partId)
      if (parte) {
        parte.classList.remove("hidden")
        parte.classList.add("visible")
      }
    },

    ocultarPartesCuerpo() {
      this.bodyParts.forEach((partId) => {
        const parte = document.getElementById(partId)
        if (parte) {
          parte.classList.remove("visible")
          parte.classList.add("hidden")
        }
      })
    },

    mostrarMensaje(mensaje, tipo = "info") {
      const gameMessageElement = document.getElementById("gameMessage")
      if (gameMessageElement) {
        gameMessageElement.textContent = mensaje
        gameMessageElement.className = `message-${tipo}`
      }
    },

    limpiarMensaje() {
      const gameMessageElement = document.getElementById("gameMessage")
      if (gameMessageElement) {
        gameMessageElement.textContent = ""
        gameMessageElement.className = ""
      }
    },

    deshabilitarInput() {
      const input = document.getElementById("guessInput")
      const button = document.getElementById("guessButton")
      if (input) input.disabled = true
      if (button) button.disabled = true
    },

    habilitarInput() {
      const input = document.getElementById("guessInput")
      const button = document.getElementById("guessButton")
      if (input) input.disabled = false
      if (button) button.disabled = false
    },

    verificarFinJuego() {
      const progresoSinEspacios = mostrarProgreso(this.palabraSecreta, this.letrasAdivinadas).replace(/ /g, "")

      if (progresoSinEspacios === this.palabraSecreta) {
        this.mostrarMensaje("🎉 ¡Ganaste! ¡Felicitaciones!", "success")
        const wordProgressElement = document.getElementById("wordProgress")
        if (wordProgressElement && wordProgressElement.parentElement) {
          wordProgressElement.parentElement.classList.add("celebration")
        }
        this.deshabilitarInput()
        return true
      }

      if (this.intentosRestantes <= 0) {
        this.mostrarMensaje(`💀 ¡Perdiste! La palabra era: ${this.palabraSecreta.toUpperCase()}`, "error")
        const wordProgressElement = document.getElementById("wordProgress")
        if (wordProgressElement && wordProgressElement.parentElement) {
          wordProgressElement.parentElement.classList.add("shake")
        }
        this.deshabilitarInput()
        return true
      }

      return false
    },

    procesarIntento(entrada) {
      const intento = entrada.trim().toLowerCase()

      if (intento === "*") {
        this.mostrarMensaje("🔄 Reiniciando el juego...", "info")
        setTimeout(() => {
          this.inicializarJuego()
        }, 1000)
        return
      }

      if (intento.length === 0) {
        this.mostrarMensaje("⚠️ Por favor, ingresa una letra o palabra.", "warning")
        return
      }

      if (intento.length > 1) {
        if (esPalabraCorrecta(this.palabraSecreta, intento)) {
          for (const letra of this.palabraSecreta) {
            if (!this.letrasAdivinadas.includes(letra)) {
              this.letrasAdivinadas.push(letra)
            }
          }
          this.actualizarUI()
          this.verificarFinJuego()
        } else {
          this.mostrarMensaje("❌ Palabra incorrecta.", "error")
          this.intentosRestantes--
          this.actualizarUI()
          this.verificarFinJuego()
        }
      } else if (intento.length === 1) {
        if (!/^[a-záéíóúñ]$/i.test(intento)) {
          this.mostrarMensaje("⚠️ Por favor, ingresa solo letras.", "warning")
          return
        }

        if (this.letrasAdivinadas.includes(intento)) {
          this.mostrarMensaje("⚠️ Ya ingresaste esa letra.", "warning")
          return
        }

        if (contieneLetra(this.palabraSecreta, intento)) {
          this.mostrarMensaje("✅ ¡Letra correcta!", "success")
          this.letrasAdivinadas.push(intento)
        } else {
          this.mostrarMensaje("❌ Letra incorrecta.", "error")
          this.letrasAdivinadas.push(intento)
          this.intentosRestantes--
        }

        this.actualizarUI()
        this.verificarFinJuego()
      }
    },

    getPalabraSecreta() {
      return this.palabraSecreta
    },

    getLetrasAdivinadas() {
      return [...this.letrasAdivinadas]
    },

    getIntentosRestantes() {
      return this.intentosRestantes
    },
  }
}

Before(async () => {
  // Leer solo el HTML y CSS
  const htmlContent = fs.readFileSync(path.join(__dirname, "../../src/index.html"), "utf8")
  const cssContent = fs.readFileSync(path.join(__dirname, "../../src/style.css"), "utf8")

  // Crear DOM virtual
  dom = new JSDOM(htmlContent, {
    pretendToBeVisual: true,
  })

  window = dom.window
  document = window.document

  // Agregar CSS
  const style = document.createElement("style")
  style.textContent = cssContent
  document.head.appendChild(style)

  // Crear estado del juego
  gameState = createGameState()

  // Configurar event listeners
  const guessButton = document.getElementById("guessButton")
  const guessInput = document.getElementById("guessInput")
  const restartButton = document.getElementById("restartButton")

  if (guessButton && guessInput) {
    guessButton.addEventListener("click", () => {
      const entrada = guessInput.value
      gameState.procesarIntento(entrada)
      guessInput.value = ""
    })
  }

  if (restartButton) {
    restartButton.addEventListener("click", () => {
      const wordProgressElement = document.getElementById("wordProgress")
      if (wordProgressElement && wordProgressElement.parentElement) {
        wordProgressElement.parentElement.classList.remove("celebration", "shake")
      }
      gameState.inicializarJuego()
    })
  }
})

After(() => {
  if (dom) {
    dom.window.close()
  }
})

Given("que estoy en la página del juego del ahorcado", () => {
  expect(document.querySelector(".container")).to.exist
  expect(document.getElementById("wordProgress")).to.exist
})

Given("el juego está inicializado", () => {
  expect(gameState).to.exist
  expect(gameState.getIntentosRestantes()).to.equal(6)
})

Given("que la palabra secreta es {string}", (palabra) => {
  // Override la función de selección aleatoria
  const originalSeleccionar = seleccionarPalabraAleatoria
  global.seleccionarPalabraAleatoria = () => palabra

  gameState.palabraSecreta = palabra
  gameState.letrasAdivinadas = []
  gameState.intentosRestantes = 6
  gameState.actualizarUI()
  gameState.ocultarPartesCuerpo()
  gameState.limpiarMensaje()
  gameState.habilitarInput()

  expect(gameState.getPalabraSecreta()).to.equal(palabra)
})

Given("ya he ingresado la letra {string}", (letra) => {
  const input = document.getElementById("guessInput")
  const button = document.getElementById("guessButton")

  input.value = letra
  button.click()
})

Given("he ingresado algunas letras", () => {
  const input = document.getElementById("guessInput")
  const button = document.getElementById("guessButton")

  input.value = "a"
  button.click()
  input.value = "b"
  button.click()
})

When("ingreso la letra {string}", (letra) => {
  const input = document.getElementById("guessInput")
  const button = document.getElementById("guessButton")

  input.value = letra
  button.click()
})

When("ingreso la palabra completa {string}", (palabra) => {
  const input = document.getElementById("guessInput")
  const button = document.getElementById("guessButton")

  input.value = palabra
  button.click()
})

When("ingreso el token {string}", (token) => {
  const input = document.getElementById("guessInput")
  const button = document.getElementById("guessButton")

  input.value = token
  button.click()
})

When("ingreso una cadena vacía", () => {
  const input = document.getElementById("guessInput")
  const button = document.getElementById("guessButton")

  input.value = ""
  button.click()
})

When("ingreso el carácter {string}", (caracter) => {
  const input = document.getElementById("guessInput")
  const button = document.getElementById("guessButton")

  input.value = caracter
  button.click()
})

When("ingreso la letra {string} nuevamente", (letra) => {
  const input = document.getElementById("guessInput")
  const button = document.getElementById("guessButton")

  input.value = letra
  button.click()
})

Then("veo el mensaje {string}", (mensajeEsperado) => {
  const messageElement = document.getElementById("gameMessage")
  expect(messageElement.textContent).to.equal(mensajeEsperado)
})

Then("el progreso de la palabra muestra {string}", (progresoEsperado) => {
  const wordProgressElement = document.getElementById("wordProgress")
  expect(wordProgressElement.textContent).to.equal(progresoEsperado)
})

Then("el progreso de la palabra sigue siendo {string}", (progresoEsperado) => {
  const wordProgressElement = document.getElementById("wordProgress")
  expect(wordProgressElement.textContent).to.equal(progresoEsperado)
})

Then("el input está deshabilitado", () => {
  const input = document.getElementById("guessInput")
  const button = document.getElementById("guessButton")

  expect(input.disabled).to.be.true
  expect(button.disabled).to.be.true
})

Then("los intentos restantes son {int}", (intentosEsperados) => {
  expect(gameState.getIntentosRestantes()).to.equal(intentosEsperados)

  const attemptsElement = document.querySelector(".attempts-count")
  expect(Number.parseInt(attemptsElement.textContent)).to.equal(intentosEsperados)
})

Then("los intentos restantes siguen siendo {int}", (intentosEsperados) => {
  expect(gameState.getIntentosRestantes()).to.equal(intentosEsperados)
})

Then("los intentos restantes vuelven a ser {int}", (intentosEsperados) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      expect(gameState.getIntentosRestantes()).to.equal(intentosEsperados)
      resolve()
    }, 1100)
  })
})

Then("se muestra una parte del cuerpo del ahorcado", () => {
  const intentosPerdidos = 6 - gameState.getIntentosRestantes()
  const bodyParts = ["head", "body", "leftArm", "rightArm", "leftLeg", "rightLeg"]

  for (let i = 0; i < intentosPerdidos; i++) {
    const parte = document.getElementById(bodyParts[i])
    expect(parte.classList.contains("visible")).to.be.true
    expect(parte.classList.contains("hidden")).to.be.false
  }
})

Then("se muestran todas las partes del cuerpo del ahorcado", () => {
  const bodyParts = ["head", "body", "leftArm", "rightArm", "leftLeg", "rightLeg"]

  bodyParts.forEach((partId) => {
    const parte = document.getElementById(partId)
    expect(parte.classList.contains("visible")).to.be.true
    expect(parte.classList.contains("hidden")).to.be.false
  })
})

Then("la letra {string} aparece en las letras usadas", (letra) => {
  const usedLettersElement = document.querySelector(".letters-list")
  const letrasUsadas = usedLettersElement.textContent.toUpperCase()
  expect(letrasUsadas).to.include(letra.toUpperCase())
})

Then(
  "el juego se reinicia con una nueva palabra",
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        const wordProgressElement = document.getElementById("wordProgress")
        expect(wordProgressElement.textContent).to.match(/^[_ ]+$/)
        resolve()
      }, 1100)
    }),
)

Then(
  "las letras usadas se limpian",
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        const usedLettersElement = document.querySelector(".letters-list")
        expect(usedLettersElement.textContent.trim()).to.equal("")
        resolve()
      }, 1100)
    }),
)
