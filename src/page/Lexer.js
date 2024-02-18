export default class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.line = 1;
    this.tokenTable = [
      { regex: /fc/, type: "FUNCION" },
      { regex: /for/, type: "FOR" },
      { regex: /if/, type: "IF" },
      { regex: /int|string|float|bool/, type: "TIPO" },
      { regex: /return/, type: "RETURN" },
      // { regex: /contenido/, type: "CONTENIDO" },
      { regex: /(<=|>=|!=|==|<|>)/, type: "OPERADOR" },
      { regex: /\(/, type: "ABRIR_PARENTESIS" },
      { regex: /\)/, type: "CERRAR_PARENTESIS" },
      { regex: /\{/, type: "ABRIR_CORCHETE" },
      { regex: /\}/, type: "CERRAR_CORCHETE" },
      { regex: /:/, type: "DOS_PUNTOS" },
      { regex: /;/, type: "PUNTO_COMA" },
      { regex: /\++/, type: "INCREMENTO" },
      { regex: /,/, type: "COMA" },
      { regex: /[0-9]+/, type: "DIGITO" },
      { regex: /[a-zA-Z]+/, type: "NOMBRE" },
    ];
  }

  getNextToken() {
    while (this.position < this.input.length) {
      let char = this.input[this.position];
      for (const tokenDef of this.tokenTable) {
        const match = this.input.slice(this.position).match(tokenDef.regex);
        if (match && match.index === 0) {
          this.position += match[0].length;
          if (char === "\n") {
            this.line++;
          }
          return { type: tokenDef.type, value: match[0], line: this.line };
        }
      }
      if (/\s/.test(char)) {
        this.position++;
        if (char === "\n") {
          this.line++;
        }
        continue;
      }
      throw new Error(`Caracter inesperado: ${char} en la línea ${this.line}`);
    }
    return { type: "FINAL", value: null };
  }
}
