import React, { useState } from "react";
import Monaco from "@monaco-editor/react";
import CodeBugDocs from "../components/CodeBugDocs";
import Parser from "./Parser";
import Lexer from "./Lexer";

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
      while (token.type !== "FINAL") {
        tokens.push(token);
        token = lexer.getNextToken();
      }
      setEsValido(true);

      // Aquí instancias y usas el Parser
      const parser = new Parser(tokens);
      parser.parse();
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
            console.log("Valor:", newValue);
            setCodigo(newValue);
          }}
        />
        <div className="line-validator">
          <button onClick={handleValidarClick}>Validar Código</button>
          {esValido !== null && (
            <p>
              {esValido ? "válido" : "inválido"}
              {esValido === false && errorMessage && (
                <span style={{ color: "red", marginLeft: "10px" }}>
                  {errorMessage}
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      <div style={{ marginLeft: "25px" }}>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {resul.map((info, index) => (
            <li key={index} style={{ marginTop: "1cm" }}>
              {info}
            </li>
          ))}
        </ul>
      </div>
      <CodeBugDocs />
    </>
  );
}

export default Home;
