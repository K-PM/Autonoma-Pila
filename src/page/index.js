class Lexer {
    constructor(input) {
      this.input = input;
      this.position = 0;
      this.tokenTable = [
        { regex: /funcion/, type: 'FUNCION' },
        { regex: /[a-zA-Z]+/, type: 'NOMBRE' },
        { regex: /int|string|float|bool/, type: 'TIPO' },
        { regex: /return/, type: 'RETURN' },
        { regex: /for/, type: 'FOR' },
        { regex: /if/, type: 'IF' },
        { regex: /\(/, type: 'ABRIR_PARENTESIS' },
        { regex: /\)/, type: 'CERRAR_PARENTESIS' },
        { regex: /\{/, type: 'ABRIR_CORCHETE' },
        { regex: /\}/, type: 'CERRAR_CORCHETE' },
        { regex: /:/, type: 'DOS_PUNTOS' },
        { regex: /;/, type: 'PUNTO_COMA' },
        { regex: /,/, type: 'COMA' }, // Agregado para manejar la coma
        { regex: /[0-9]+/, type: 'DIGITO' },
        { regex: /(<|>|<=|>=|!=|==)/, type: 'OPERADOR' },
      ];
    }
  
    getNextToken() {
      while (this.position < this.input.length) {
        let char = this.input[this.position];
        for (const tokenDef of this.tokenTable) {
          const match = this.input.slice(this.position).match(tokenDef.regex);
          if (match && match.index === 0) {
            this.position += match[0].length;
            return { type: tokenDef.type, value: match[0] };
          }
        }
        // Ignorar espacios en blanco
        if (/\s/.test(char)) {
          this.position++;
          continue;
        }
        // Encontrar tokens/signos desconocidos 
        throw new Error(`Caracter inesperado: ${char}`);
      }
      //devolver token de fin
      return { type: 'FINAL', value: null };
    }
  
    analyze() {
      let token = this.getNextToken();
      while (token.type !== 'FINAL') {
        console.log(token);
        token = this.getNextToken();
      }
    }
  }
  // Ejemplo de uso
  const input = 'variable:sa';
  const lexer = new Lexer(input);
  lexer.analyze();
  

  