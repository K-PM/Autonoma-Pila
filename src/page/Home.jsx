import React, { useState } from "react";
import Monaco from "@monaco-editor/react";
import CodeBugDocs from "../components/CodeBugDocs";


function Home() {
  const [codigo, setCodigo] = useState("");
  const [resul, setResul] = useState([]);
  const [esValido, setEsValido] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  
  function handleValidarClick() {
    analizarCodigo();
  }

  const analizarCodigo = () => {
    const lexer = new Lexer(codigo);
    let tokens = [];
    let error = null;
  
    try {
      let token = lexer.getNextToken();
      while (token.type !== 'FINAL') {
        tokens.push(token);
        token = lexer.getNextToken();
      }
      setEsValido(true);
    } catch (err) {
      setEsValido(false);
      error = `Error en la posición ${lexer.position}: ${err.message}`;
    }
  
    setResul(tokens.map((token) => `${token.type}: ${token.value}`));
    setErrorMessage(error);  
  };



  function setEditorTheme(monaco) {
    monaco.editor.defineTheme("codebug", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#141417",
        "editor.lineHighlightBackground": "#FFFFFF0F",
      },
    });
  }
  return (
    <>
      <div className="title">
        <h1>CodeBug</h1>
        <h2>Crescencio Perez Santiz</h2>
        <h2>Kristell Perez Mateos</h2>
      </div>
      <div className="area">
        <Monaco
          beforeMount={setEditorTheme}
          width="800"
          height="50vh"
          language="javascript"
          theme="codebug"
          value={codigo}
          options={{
            selectOnLineNumbers: false,
            mouseStyle: "text",
            acceptSuggestionOnEnter: "off",
            quickSuggestions: false,
          }}
          onChange={(newValue) => {
            console.log("Valor:", newValue); setCodigo(newValue);
          }}
        />
       <div className="line-validator">
          <button onClick={handleValidarClick}>Validar Código</button>
          {esValido !== null && (
            <p>
              {esValido ? 'válido' : 'inválido'}
              {esValido === false && errorMessage && ( 
                <span style={{ color: 'red', marginLeft: '10px' }}>
                  {errorMessage}
                </span>
              )}
            </p>
          )}
        </div>


      </div>
      
      <div style={{ marginLeft: '25px' }}>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {resul.map((info, index) => (
            <li key={index} style={{ marginTop: '1cm' }}>{info}</li>
          ))}
        </ul>
      </div>



      <CodeBugDocs/>
    </>
  );
}



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
      { regex: /,/, type: 'COMA' }, 
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
      if (/\s/.test(char)) {
        this.position++;
        continue;
      }
      throw new Error(`Caracter inesperado: ${char}`);
    }
    return { type: 'FINAL', value: null };
  }
}





export default Home;
