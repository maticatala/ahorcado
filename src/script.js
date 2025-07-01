import {
  seleccionarPalabraAleatoria,
  contieneLetra,
  esPalabraCorrecta,
  mostrarProgreso
} from './game.js';

export const diccionario = ['javascript', 'react', 'angular', 'node', 'express'];

// Variables del juego
let palabraSecreta = ""
let letrasAdivinadas = []
let intentosRestantes = 6
const restart_token = "*"

// Elementos del DOM
const wordProgressElement = document.getElementById("wordProgress")
const attemptsLeftElement = document.querySelector(".attempts-count")
const usedLettersElement = document.querySelector(".letters-list")
const guessInput = document.getElementById("guessInput")
const guessButton = document.getElementById("guessButton")
const gameMessageElement = document.getElementById("gameMessage")
const restartButton = document.getElementById("restartButton")

// Partes del cuerpo del ahorcado
const bodyParts = ["head", "body", "leftArm", "rightArm", "leftLeg", "rightLeg"]

// Inicializar el juego
function inicializarJuego() {
  palabraSecreta = seleccionarPalabraAleatoria(diccionario)
  letrasAdivinadas = []
  intentosRestantes = 6

  actualizarUI()
  ocultarPartesCuerpo()
  limpiarMensaje()
  habilitarInput()

  console.log("Nueva palabra secreta:", palabraSecreta) // Para debugging
}

// Actualizar la interfaz de usuario
function actualizarUI() {
  // Actualizar progreso de la palabra
  const progreso = mostrarProgreso(palabraSecreta, letrasAdivinadas)
  wordProgressElement.textContent = progreso

  // Actualizar intentos restantes
  attemptsLeftElement.textContent = intentosRestantes
  attemptsLeftElement.style.color = intentosRestantes <= 2 ? "#e53e3e" : "#2d3748"

  // Actualizar letras usadas
  usedLettersElement.textContent = letrasAdivinadas.join(" ").toUpperCase()

  // Mostrar partes del cuerpo según intentos perdidos
  const intentosPerdidos = 6 - intentosRestantes
  for (let i = 0; i < intentosPerdidos; i++) {
    if (bodyParts[i]) {
      mostrarParteCuerpo(bodyParts[i])
    }
  }
}

// Mostrar parte del cuerpo del ahorcado
function mostrarParteCuerpo(partId) {
  const parte = document.getElementById(partId)
  if (parte) {
    parte.classList.remove("hidden")
    parte.classList.add("visible")
  }
}

// Ocultar todas las partes del cuerpo
function ocultarPartesCuerpo() {
  bodyParts.forEach((partId) => {
    const parte = document.getElementById(partId)
    if (parte) {
      parte.classList.remove("visible")
      parte.classList.add("hidden")
    }
  })
}

// Mostrar mensaje con estilo
function mostrarMensaje(mensaje, tipo = "info") {
  gameMessageElement.textContent = mensaje
  gameMessageElement.className = `message-${tipo}`
}

// Limpiar mensaje
function limpiarMensaje() {
  gameMessageElement.textContent = ""
  gameMessageElement.className = ""
}

// Deshabilitar input
function deshabilitarInput() {
  guessInput.disabled = true
  guessButton.disabled = true
}

// Habilitar input
function habilitarInput() {
  guessInput.disabled = false
  guessButton.disabled = false
  guessInput.focus()
}

// Verificar si el juego ha terminado
function verificarFinJuego() {
  const progresoSinEspacios = mostrarProgreso(palabraSecreta, letrasAdivinadas).replace(/ /g, "")

  // Verificar victoria
  if (progresoSinEspacios === palabraSecreta) {
    mostrarMensaje("🎉 ¡Ganaste! ¡Felicitaciones!", "success")
    wordProgressElement.parentElement.classList.add("celebration")
    deshabilitarInput()
    return true
  }

  // Verificar derrota
  if (intentosRestantes <= 0) {
    mostrarMensaje(`💀 ¡Perdiste! La palabra era: ${palabraSecreta.toUpperCase()}`, "error")
    wordProgressElement.parentElement.classList.add("shake")
    deshabilitarInput()
    return true
  }

  return false
}

// Procesar intento del jugador
function procesarIntento(entrada) {
  const intento = entrada.trim().toLowerCase()

  // Verificar token de reinicio
  if (intento === restart_token) {
    mostrarMensaje("🔄 Reiniciando el juego...", "info")
    setTimeout(() => {
      inicializarJuego()
    }, 1000)
    return
  }

  // Validar entrada vacía
  if (intento.length === 0) {
    mostrarMensaje("⚠️ Por favor, ingresa una letra o palabra.", "warning")
    return
  }

  // Intento de palabra completa
  if (intento.length > 1) {
    if (esPalabraCorrecta(palabraSecreta, intento)) {
      // Agregar todas las letras de la palabra a letrasAdivinadas
      for (const letra of palabraSecreta) {
        if (!letrasAdivinadas.includes(letra)) {
          letrasAdivinadas.push(letra)
        }
      }
      actualizarUI()
      verificarFinJuego()
    } else {
      mostrarMensaje("❌ Palabra incorrecta.", "error")
      intentosRestantes--
      actualizarUI()
      verificarFinJuego()
    }
  }
  // Intento de letra individual
  else if (intento.length === 1) {
    // Verificar si es una letra válida
    if (!/^[a-záéíóúñ]$/i.test(intento)) {
      mostrarMensaje("⚠️ Por favor, ingresa solo letras.", "warning")
      return
    }

    // Verificar si la letra ya fue ingresada
    if (letrasAdivinadas.includes(intento)) {
      mostrarMensaje("⚠️ Ya ingresaste esa letra.", "warning")
      return
    }

    // Procesar letra nueva
    if (contieneLetra(palabraSecreta, intento)) {
      mostrarMensaje("✅ ¡Letra correcta!", "success")
      letrasAdivinadas.push(intento)
    } else {
      mostrarMensaje("❌ Letra incorrecta.", "error")
      letrasAdivinadas.push(intento)
      intentosRestantes--
    }

    actualizarUI()
    verificarFinJuego()
  }
}

// Event Listeners
guessButton.addEventListener("click", () => {
  const entrada = guessInput.value
  procesarIntento(entrada)
  guessInput.value = ""
  guessInput.focus()
})

guessInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    guessButton.click()
  }
})

restartButton.addEventListener("click", () => {
  // Remover clases de animación
  wordProgressElement.parentElement.classList.remove("celebration", "shake")
  inicializarJuego()
})

// Prevenir envío de formulario si el input está dentro de un form
guessInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault()
  }
})

// Inicializar el juego al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  inicializarJuego()
})

// Exponer funciones para testing
window.HangmanGame = {
  inicializarJuego,
  procesarIntento,
  verificarFinJuego,
  getPalabraSecreta: () => palabraSecreta,
  getLetrasAdivinadas: () => [...letrasAdivinadas],
  getIntentosRestantes: () => intentosRestantes,
}
