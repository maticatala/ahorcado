const { esPalabraCorrecta } = require('../src/game.js');
const { contieneLetra } = require('../src/game');


describe('Juego del ahorcado', () => {
    
    describe('esPalabraCorrecta()', () => {
        test('test_arriesgar_palabra_igual_a_secreta_retorna_true', () => {
            const palabraSecreta = 'javascript';
            const intento = 'javascript';

            const resultado = esPalabraCorrecta(palabraSecreta, intento);

            expect(resultado).toBe(true);
        })
    })

    describe('esPalabraIncorrecta()', () => {
        test('test_arriesgar_palabra_distinta_a_secreta_retorna_false', () => {
            const palabraSecreta = 'javascript';
            const intento = 'grupo06';

            const resultado = esPalabraCorrecta(palabraSecreta, intento);

            expect(resultado).toBe(false);
        })
    })

  describe('contieneLetra()', () => {
    test('retorna true si la letra está en la palabra', () => {
      const palabraSecreta = 'angular';
      const letra = 'g';
      const resultado = contieneLetra(palabraSecreta, letra);
      expect(resultado).toBe(true);
    });

    test('retorna false si la letra no está en la palabra', () => {
      const palabraSecreta = 'angular';
      const letra = 'z';
      const resultado = contieneLetra(palabraSecreta, letra);
      expect(resultado).toBe(false);
    });

    test('retorna true si la letra aparece más de una vez', () => {
      const palabraSecreta = 'banana';
      const letra = 'a';
      const resultado = contieneLetra(palabraSecreta, letra);
      expect(resultado).toBe(true);
    });

    test('retorna false si se pasa una cadena vacía como letra', () => {
      const palabraSecreta = 'banana';
      const letra = '';
      const resultado = contieneLetra(palabraSecreta, letra);
      expect(resultado).toBe(false);
    });
  });
    
})