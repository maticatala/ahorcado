function esPalabraCorrecta(palabraSecreta, intento) {
  return palabraSecreta === intento;
}

function contieneLetra(palabraSecreta, letra) {
  if (!letra) return false;
  return palabraSecreta.includes(letra);
}

function mostrarProgreso(palabraSecreta, letrasAdivinadas) {
  return palabraSecreta
    .split('')
    .map(letra => letrasAdivinadas.includes(letra) ? letra : '_')
    .join(' ');
}

function seleccionarPalabraAleatoria(diccionario) {
  if (!diccionario.length) return undefined;
  const indice = Math.floor(Math.random() * diccionario.length);
  return diccionario[indice];
}

export {
  esPalabraCorrecta,
  contieneLetra,
  mostrarProgreso,
  seleccionarPalabraAleatoria
};