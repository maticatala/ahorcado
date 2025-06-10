function esPalabraCorrecta(palabraSecreta, intento) {
  return palabraSecreta === intento;
}
function contieneLetra(palabraSecreta, letra) {
  if (!letra) return false; // evita letras vacías, null, undefined
  return palabraSecreta.includes(letra);
}

function mostrarProgreso(palabraSecreta, letrasAdivinadas) {
  return palabraSecreta
    .split('')
    .map(letra => letrasAdivinadas.includes(letra) ? letra : '_')
    .join(' ');
}

module.exports = { esPalabraCorrecta, contieneLetra, mostrarProgreso };