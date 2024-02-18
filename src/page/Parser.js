export default class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  // Este método consume el siguiente token si su tipo coincide con el esperado
  consume(tokenType) {
    if (this.match(tokenType)) {
      let currentLine = this.tokens[this.position].line;
      this.position++;
      return currentLine;
    } else {
      let currentLine =
        this.position < this.tokens.length
          ? this.tokens[this.position].line
          : "desconocida";
      throw new Error(
        `Se esperaba ${tokenType}, pero se encontró ${
          this.position < this.tokens.length
            ? this.tokens[this.position].type
            : "desconocido"
        } en la línea ${currentLine}`
      );
    }
  }

  // Este método verifica si el siguiente token es de un tipo específico
  match(type) {
    return (
      this.position < this.tokens.length &&
      this.tokens[this.position].type === type
    );
  }

  valueReturn() {
    if (this.match("DIGITO") || this.match("NOMBRE")) {
      while (this.match("DIGITO") || this.match("NOMBRE")) {
        let currentLine = this.tokens[this.position - 1].line;
        if (this.match("DIGITO")) {
          this.consume("DIGITO");
        } else if (this.match("NOMBRE")) {
          if (this.match("NOMBRE") || this.match("DIGITO")) {
            this.validarNombreODigito();
          }
        } else if (this.match("NOMBRE")) {
          this.consume("NOMBRE");
        } else {
          throw new Error(
            `Se esperaba un DIGITO, un NOMBRE o una combinación de NOMBRE y DIGITO en la línea ${currentLine}`
          );
        }
      }
    } else {
      let currentLine = this.tokens[this.position - 1].line;
      throw new Error(
        `Se esperaba un valor de retorno en la línea ${currentLine}`
      );
    }
  }

  validarNombreODigito() {
    let currentLine = this.tokens[this.position].line;
    if (this.match("NOMBRE")) {
      this.consume("NOMBRE");
      if (this.match("DIGITO")) {
        this.consume("DIGITO");
      }
    } else {
      throw new Error(
        `Se esperaba un NOMBRE o una combinación de NOMBRE y DIGITO en la línea ${currentLine}`
      );
    }
  }

  value() {
    if (this.position < this.tokens.length) {
      if (this.match("NOMBRE")) {
        let currentLine = this.tokens[this.position - 1].line;
        this.consume("NOMBRE");
        if (this.match("DIGITO")) {
          this.consume("DIGITO");
        } else {
          throw new Error(
            `Valor vacío no permitido en la línea ${currentLine}`
          );
        }
      } else if (this.match("DIGITO")) {
        this.consume("DIGITO");
      } else {
        let currentLine = this.tokens[this.position - 1].line;
        throw new Error(`Valor vacío no permitido en la línea ${currentLine}`);
      }
    } else {
      throw new Error(
        `Se esperaba un token, pero no hay más tokens en la línea ${
          this.tokens[this.position - 1].line
        }`
      );
    }
  }

  body() {
    while (!this.match("RETURN")) {
      this.statement();
    }
  }

  contentFor() {
    let currentLine = this.tokens[this.position].line;
    if (this.match("NOMBRE")) {
      this.consume("NOMBRE");
      this.consume("DOS_PUNTOS");
      this.value();
    } else {
      throw new Error(
        `Declaración no válida: ${
          this.tokens[this.position].type
        } en la línea ${currentLine}`
      );
    }
  }

  statement() {
    if (this.match("FUNCION")) {
      this.consume("FUNCION");
      this.consume("NOMBRE");
      this.consume("ABRIR_PARENTESIS");
      this.consume("NOMBRE");
      this.consume("COMA");
      this.consume("NOMBRE");
      this.consume("CERRAR_PARENTESIS");
      this.consume("TIPO");
      this.consume("ABRIR_CORCHETE");
      this.body();
      this.consume("RETURN");
      this.valueReturn();
      this.consume("CERRAR_CORCHETE");
    } else if (this.match("NOMBRE")) {
      this.consume("NOMBRE");
      this.consume("DOS_PUNTOS");
      this.value();
    } else if (this.match("FOR")) {
      this.consume("FOR");
      this.consume("NOMBRE");
      this.consume("PUNTO_COMA");
      this.consume("NOMBRE");
      this.consume("PUNTO_COMA");
      this.consume("DIGITO");
      this.consume("INCREMENTO");
      this.consume("ABRIR_CORCHETE");
      this.body();
      this.consume("RETURN");
      this.valueReturn();
      this.consume("CERRAR_CORCHETE");
    } else if (this.match("IF")) {
      this.consume("IF");
      this.consume("ABRIR_PARENTESIS");
      this.validarNombreODigito();
      this.consume("OPERADOR");
      this.validarNombreODigito();
      this.consume("CERRAR_PARENTESIS");
      this.consume("ABRIR_CORCHETE");
      this.body();
      this.consume("RETURN");
      this.valueReturn();
      this.consume("CERRAR_CORCHETE");
    } else {
      throw new Error(
        `Declaración no válida: ${this.tokens[this.position].type}`
      );
    }
  }

  program() {
    while (this.position < this.tokens.length) {
      this.statement();
    }
  }

  parse() {
    this.program();
    if (this.position !== this.tokens.length) {
      throw new Error("Tokens restantes");
    }
  }
}
