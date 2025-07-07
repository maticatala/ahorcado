# language: es
Característica: Juego del Ahorcado
  Como jugador
  Quiero jugar al ahorcado
  Para adivinar palabras y divertirme

  Antecedentes:
    Dado que estoy en la página del juego del ahorcado
    Y el juego está inicializado

  Escenario: Ganar el juego adivinando letra por letra
    Dado que la palabra secreta es "react"
    Cuando ingreso la letra "r"
    Entonces veo el mensaje "✅ ¡Letra correcta!"
    Y el progreso de la palabra muestra "r _ _ _ _"
    Cuando ingreso la letra "e"
    Entonces veo el mensaje "✅ ¡Letra correcta!"
    Y el progreso de la palabra muestra "r e _ _ _"
    Cuando ingreso la letra "a"
    Entonces veo el mensaje "✅ ¡Letra correcta!"
    Y el progreso de la palabra muestra "r e a _ _"
    Cuando ingreso la letra "c"
    Entonces veo el mensaje "✅ ¡Letra correcta!"
    Y el progreso de la palabra muestra "r e a c _"
    Cuando ingreso la letra "t"
    Entonces veo el mensaje "🎉 ¡Ganaste! ¡Felicitaciones!"
    Y el progreso de la palabra muestra "r e a c t"
    Y el input está deshabilitado

  Escenario: Ganar el juego adivinando la palabra completa
    Dado que la palabra secreta es "javascript"
    Cuando ingreso la palabra completa "javascript"
    Entonces veo el mensaje "🎉 ¡Ganaste! ¡Felicitaciones!"
    Y el progreso de la palabra muestra "j a v a s c r i p t"
    Y el input está deshabilitado

  Escenario: Perder el juego por agotar intentos
    Dado que la palabra secreta es "react"
    Cuando ingreso la letra "z"
    Entonces veo el mensaje "❌ Letra incorrecta."
    Y los intentos restantes son 5
    Y se muestra una parte del cuerpo del ahorcado
    Cuando ingreso la letra "x"
    Entonces veo el mensaje "❌ Letra incorrecta."
    Y los intentos restantes son 4
    Cuando ingreso la letra "w"
    Entonces veo el mensaje "❌ Letra incorrecta."
    Y los intentos restantes son 3
    Cuando ingreso la letra "v"
    Entonces veo el mensaje "❌ Letra incorrecta."
    Y los intentos restantes son 2
    Cuando ingreso la letra "u"
    Entonces veo el mensaje "❌ Letra incorrecta."
    Y los intentos restantes son 1
    Cuando ingreso la letra "s"
    Entonces veo el mensaje "💀 ¡Perdiste! La palabra era: REACT"
    Y los intentos restantes son 0
    Y el input está deshabilitado
    Y se muestran todas las partes del cuerpo del ahorcado

  Escenario: Ingresar letra correcta
    Dado que la palabra secreta es "node"
    Cuando ingreso la letra "n"
    Entonces veo el mensaje "✅ ¡Letra correcta!"
    Y el progreso de la palabra muestra "n _ _ _"
    Y la letra "N" aparece en las letras usadas
    Y los intentos restantes siguen siendo 6

  Escenario: Ingresar letra incorrecta
    Dado que la palabra secreta es "node"
    Cuando ingreso la letra "z"
    Entonces veo el mensaje "❌ Letra incorrecta."
    Y el progreso de la palabra sigue siendo "_ _ _ _"
    Y la letra "Z" aparece en las letras usadas
    Y los intentos restantes son 5
    Y se muestra una parte del cuerpo del ahorcado

  Escenario: Ingresar letra ya utilizada
    Dado que la palabra secreta es "express"
    Y ya he ingresado la letra "e"
    Cuando ingreso la letra "e" nuevamente
    Entonces veo el mensaje "⚠️ Ya ingresaste esa letra."
    Y los intentos restantes siguen siendo 6

  Escenario: Ingresar palabra incorrecta
    Dado que la palabra secreta es "angular"
    Cuando ingreso la palabra completa "react"
    Entonces veo el mensaje "❌ Palabra incorrecta."
    Y los intentos restantes son 5
    Y se muestra una parte del cuerpo del ahorcado

  Escenario: Reiniciar juego con token especial
    Dado que la palabra secreta es "react"
    Y he ingresado algunas letras
    Cuando ingreso el token "*"
    Entonces veo el mensaje "🔄 Reiniciando el juego..."
    Y el juego se reinicia con una nueva palabra
    Y los intentos restantes vuelven a ser 6
    Y las letras usadas se limpian

  Escenario: Validar entrada vacía
    Dado que la palabra secreta es "node"
    Cuando ingreso una cadena vacía
    Entonces veo el mensaje "⚠️ Por favor, ingresa una letra o palabra."
    Y los intentos restantes siguen siendo 6
