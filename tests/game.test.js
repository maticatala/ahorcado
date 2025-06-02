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
})