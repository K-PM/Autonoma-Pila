export default class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  // Este método consume el siguiente token si su tipo coincide con el esperado
  consume(type) {
    if (
      this.position < this.tokens.length &&
      this.tokens[this.position].type === type
    ) {
      return this.tokens[this.position++];
    }
    throw new Error(
      `Se esperaba token de tipo ${type}, pero se obtuvo ${
        this.position < this.tokens.length
          ? this.tokens[this.position].type
          : "undefined"
      }`
    );
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
            "Se esperaba un DIGITO, un NOMBRE o una combinación de NOMBRE y DIGITO"
          );
        }
      }
    } else {
      throw new Error("Se esperaba un valor de retorno");
    }
  }

  validarNombreODigito() {
    if (this.match("NOMBRE")) {
      this.consume("NOMBRE");
      if (this.match("DIGITO")) {
        this.consume("DIGITO");
      }
    } else {
      throw new Error(
        "Se esperaba un NOMBRE o una combinación de NOMBRE y DIGITO"
      );
    }
  }

  value() {
    if (this.match("NOMBRE")) {
      this.consume("NOMBRE");
      if (this.match("DIGITO")) {
        this.consume("DIGITO");
      }
    } else if (this.match("DIGITO")) {
      console.log("DIGITO");
      this.consume("DIGITO");
    } else {
      throw new Error("Valor vacío no permitido");
    }
  }

  body() {
    while (!this.match("RETURN")) {
      this.statement();
    }
  }

  contentFor() {
    if (this.match("NOMBRE")) {
      this.consume("NOMBRE");
      this.consume("DOS_PUNTOS");
      this.value();
    } else {
      throw new Error(
        `Declaración no válida: ${this.tokens[this.position].type}`
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
