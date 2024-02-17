console.log('Por favor, ingresa la cadena que deseas validar:');
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data) {
  const cadenaS = data.trim();

  const { esValida, infoPila } = validacion(cadenaS);

  console.log("La cadena ingresada es válida:", esValida);
  console.log("Información de la pila:");
  infoPila.forEach(info => console.log(info));

  process.exit();
});

function validacion(codigo) {
    let pila = ['$'];
    let contador = 0;
    let infoPila = [];
  
    pila[1] = 'S';

  
    const pushInfo = (X) => {
      infoPila.push(`Push: ${X} -- ${codigo.slice(contador)}`);
    };
  
    const popInfo = (X) => {
      infoPila.push(`Pop: ${X} --  ${codigo.slice(contador)}`);
    };
  
    while (pila.length > 0) {
      const X = pila.pop();
  
      if (!X) {
        break;
      }
  
      const a = codigo[contador];
  
      if (X === '$') {
        infoPila.push('Completo.');
        break;
      }
  
      if (X === a) {
        contador++;
      } else if (esNoTerminal(X)) {
        const produccion = obtenerProduccion(X, a);
  
        if (produccion) {
          pushInfo(X);
          if (produccion[0] !== 'ε') {
            for (let i = produccion.length - 1; i >= 0; i--) {
              pila.push(produccion[i]);
            }
          }
        } else {
          infoPila.push(`Error: No se pudo encontrar una producción válida para ${X}.`);
          return { esValida: false, infoPila };
        }
      } else {
        popInfo(X);
        return { esValida: false, infoPila };
      }
    }
  
    return { esValida: contador === codigo.length, infoPila };
}

function esNoTerminal(simbolo) {
    return /[A-Z]/.test(simbolo);
}

function obtenerProduccion(noTerminal, siguiente) {
    const producciones = {

        S:['I','V'],
        V:['VAR','VAR1'],
        VAR1:['A','VAR2'],
        VAR2:['AR','T'],
        T:['TIPO','G'],
        G:['N','O'],
        N:['L','N2'],
        N2:['R','IGUAL'],
        O:['TAKEDATA','P'],
        P:['P1','P2'],

        IGUAL:['='],
        TIPO: siguiente === 'i' ? ['INT', 'INT1'] :
              siguiente === 'f' ? ['FLO', 'FLO1'] :
              siguiente === 's' ? ['STR', 'STR1'] :
              null,
        P1:['('],
        P2:[')','F'],
        TAKEDATA:['TA','TAKE1'],
        TAKE1:['AK','TAKE2'],
        TAKE2:['KE','TAKE3'],
        TAKE3:['ED','TAKE4'],
        TAKE4:['DA','TAKE5'],
        TAKE5:['AK','TAKE6'],
        TAKE6:['TA','TAKE7'],

        AK:['a'],
        KE:['k'],
        ED:['e'],
        DA:['D'],
        TAKE7:['a'],
        TA:['t'],
              
        I: ['{'],
        F: ['}'],
        R: /[a-z]/.test(siguiente) ? ['L', 'R'] : ['ε'],
        L: /[a-z]/.test(siguiente) ? [siguiente] : null,

        VAR:['v'],
        A:['a'],
        AR:['r'],

        INT: ['i'],
        INT1: ['INT2', 'INT3'],
        INT2: ['n'],
        INT4: ['t'],
        INT3: ['INT4'],
        

        FLO1: ['FLO2', 'FLO3'],
        FLO: ['f'],
        FLO2: ['l'],
        FLO4: ['o'],
        FLO6: ['a'],
        FLO8: ['t'],
        FLO3: ['FLO4', 'FLO5'],
        FLO5: ['FLO6', 'FLO7'],
        FLO7: ['FLO8'],

        
        STR1: ['STR2', 'STR3'],
        STR: ['s'],
        STR2: ['t'],
        STR4: ['r'],
        STR6: ['i'],
        STR8: ['n'],
        STR10: ['g'],
        STR3: ['STR4', 'STR5'],        
        STR5: ['STR6', 'STR7'],
        STR7: ['STR8', 'STR9'],
        STR9: ['STR10'],
    };

    return producciones[noTerminal] || null;
}
