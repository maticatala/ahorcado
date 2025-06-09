function esPalabraCorrecta(palabraSecreta, intento) {
  return palabraSecreta === intento;
}
function contieneLetra(palabraSecreta, letra) {
  if (!letra) return false; // evita letras vacías, null, undefined
  return palabraSecreta.includes(letra);
}

module.exports = { esPalabraCorrecta, contieneLetra };