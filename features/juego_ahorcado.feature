# language: es
Característica: Juego del Ahorcado
  Como jugador
  Quiero jugar al ahorcado
  Para adivinar palabras y divertirme

  Antecedentes:
    Dado que el juego del ahorcado está iniciado
    Y la palabra secreta es "javascript"
    Y tengo 6 intentos restantes
    Y no he adivinado ninguna letra

  Escenario: Adivinar una letra correcta
    Dado que la palabra secreta contiene la letra "a"
    Cuando ingreso la letra "a"
    Entonces el progreso de la palabra se actualiza mostrando la letra "a"
    Y los intentos restantes siguen siendo 6
    Y la letra "a" aparece en la lista de letras usadas
    Y veo el mensaje "¡Letra correcta!"

  Escenario: Adivinar una letra incorrecta
    Dado que la palabra secreta no contiene la letra "z"
    Cuando ingreso la letra "z"
    Entonces el progreso de la palabra no cambia
    Y los intentos restantes se reducen a 5
    Y la letra "z" aparece en la lista de letras usadas
    Y veo el mensaje "Letra incorrecta."
    Y aparece una parte del dibujo del ahorcado

  Escenario: Ganar el juego
    Dado que he adivinado las letras "j", "a", "v", "s", "c", "r", "i", "p", "t"
    Cuando el progreso muestra la palabra completa
    Entonces veo el mensaje "¡Ganaste! ¡Felicitaciones!"
    Y el campo de entrada se deshabilita
    Y no puedo hacer más intentos
    Y la palabra se muestra completamente revelada

  Escenario: Perder el juego
    Dado que he hecho 5 intentos incorrectos
    Y me queda 1 intento restante
    Cuando ingreso una letra incorrecta "z"
    Entonces los intentos restantes llegan a 0
    Y veo el mensaje "¡Perdiste! La palabra era: JAVASCRIPT"
    Y el campo de entrada se deshabilita
    Y el dibujo del ahorcado está completo
    Y no puedo hacer más intentos
