const { esPalabraCorrecta } = require('../src/game.js');


describe('Juego del ahorcado', () => {
    describe('esPalabraCorrecta()', () => {
        test('test_arriesgar_palabra_igual_a_secreta_retorna_true', () => {
            // Dado que
            const palabraSecreta = 'javascript';
            const intento = 'javascript';

            // Cuando
            const resultado = esPalabraCorrecta(palabraSecreta, intento);

            // Entonces
            expect(resultado).toBe(true);
        })
    })
})