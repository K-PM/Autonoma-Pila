import React, { useState } from "react";
import Monaco from "@monaco-editor/react";
import CodeBugDocs from "../components/CodeBugDocs";


function Home() {
  const [codigo, setCodigo] = useState("");
  const [resul, setResul] = useState([]);
  const [esValido, setEsValido] = useState(null);

  
  function handleValidarClick() {

    analizarCodigo();
  }

  
  const analizarCodigo = () => {
    const cadenaS = codigo.replace(/\s/g, '');
    const { esValida, infoPila } = validacion(cadenaS);
    setEsValido(esValida);
    setResul(infoPila);
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
          {esValido !== null && (<p>{esValido ? 'válida' : 'inválida'}</p>
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


function validacion(codigo) {
  let pila = ['$'];
let contador = 0;
let infoPila = [];
const primerasDosLetras = codigo.slice(0, 2);

if (primerasDosLetras === 'if') {
  pila[1] = 'IF';
} else if (primerasDosLetras === 'fc') {
  pila[1] = 'FUNC';
} else if (primerasDosLetras === 'fo') {
  pila[1] = 'FOR';
}else {
  pila[1] = 'DV';
}



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

switch (noTerminal) {

//-----------------------------------------------

  case 'DV':
    return ['L', 'DV1'];
  case 'DV1':
    return ['RL', 'C1'];
  case 'C1':
    return ['DP', 'C2'];
  case 'C2':
    return ['D', 'C3'];
  case'C3':
    return ['RD'];
  case 'RD':
    return /[0-9]/.test(siguiente) ? ['D', 'RD'] : ['ε'];
  case 'RL':
    return /[a-z]/.test(siguiente) ? ['L', 'RL'] : ['ε'];
  case 'D':
    return /[0-9]/.test(siguiente) ? [siguiente] : null;
  case 'L':
    return /[a-z]/.test(siguiente) ? [siguiente] : null;
  case 'PC':
    return [';'];
  case 'DP':
    return [':'];
  case 'PF':
      return[')']
  case 'PI':
    return ['('];
  case 'C':
    return [','] 


    
//   ESTE ES LA DEL IF
  case 'IF':
    return ['I', 'I1'];
  case 'I':
    return ['i'];
  case 'I1':
    return ['I2', 'C4'];
  case 'I2':
    return ['f'];
  case 'C4':
    return ['PI','C5'];
  case 'C5':
    return ['L', 'C5.1'];
  case 'C5.1':
    return ['RL', 'C6'];
  case 'C6':
    return ['OP', 'C7'];
  case 'OP':
    if (siguiente === '==' || siguiente === '>'|| siguiente === '!=' || siguiente === '<' ||
        siguiente === '>=' || siguiente === '<=') {
      return [siguiente];
    } else {
      return null;}
  case 'C7':
    if (/^\d+$/.test(siguiente)) {
      // Si lo que sigue es un número, haga ['D', 'A6']
      return ['D', 'C7.1'];
    } else if (/^[a-zA-Z]$/.test(siguiente)) {
      // Si lo que sigue es una letra, haga ['OV', 'A7']
      return ['C7.2', 'C8'];
    } else {
      // Puedes ajustar según la lógica específica que necesites para otros casos
      return null;
    }
  case 'C7.1':
    return ['RD', 'C8'];
  case 'C8':
    return ['PF', 'C27']; 
    case 'C7.2':
    return ['L','RL'];
//-------------------------------------------------

// REUTILIZAR EL { return contenido }
  case 'C27':
       return ['LLAI', 'C28'];
  case 'LLAI':
       return ['{']; 
  case 'C28':
        return ['RE', 'RE1'];
  case 'RE':
        return ['r'];
  case 'RE1':
          return ['RE2', 'RE3'];
  case 'RE2':
          return ['e'];
  case 'RE3':
        return ['RE4', 'RE5'];
  case 'RE4':
        return ['t'];
  case 'RE5':
        return ['RE6', 'RE7'];
  case 'RE6':
        return ['u'];
  case 'RE7':
          return ['RE8', 'RE9'];
  case 'RE8':
          return ['r'];
  case 'RE9':
        return ['RE10', 'CO'];
  case 'RE10':
        return ['n'];
  case 'CO':
        return ['CO1', 'CO2'];
  case 'CO1':
        return ['c'];
  case 'CO2':
          return ['CO3', 'CO4'];
  case 'CO3':
          return ['o'];
  case 'CO4':
        return ['CO5', 'CO6'];
  case 'CO5':
        return ['n'];
  case 'CO6':
          return ['CO7','CO8'];
  case 'CO8':
          return ['CO9', 'CO10'];
  case 'CO7':
          return ['t'];
  case 'CO10':
        return ['CO11', 'CO12'];
  case 'CO9':
        return ['e'];
  case 'CO11':
        return ['n'];
  case 'CO12':
          return ['CO13', 'CO14'];
  case 'CO13':
          return ['i'];
  case 'CO14':
        return ['CO15', 'CO16'];
  case 'CO15':
        return ['d'];
  case 'CO16':
          return ['CO17', 'CO18'];
  case 'CO17':
          return ['o'];
  case 'CO18':
          return ['C30'];   
  case 'C30':
          return ['}']

  default:
    return null;
  }
}



export default Home;








//-----------------------------------------------------------------------
function obtenerProduccion(noTerminal, siguiente) {
  const producciones = {
      DV: ['L', 'DV1'],
      DV1: ['RL', 'C1'],
      C1: ['DP', 'C2'],
      C2: ['D', 'C3'],
      C3: ['RD'],
      RD: /[0-9]/.test(siguiente) ? ['D', 'RD'] : ['ε'],
      RL: /[a-z]/.test(siguiente) ? ['L', 'RL'] : ['ε'],
      D: /[0-9]/.test(siguiente) ? [siguiente] : null,
      L: /[a-z]/.test(siguiente) ? [siguiente] : null,
      PC: [';'],
      DP: [':'],
      PF: [')'],
      PI: ['('],
      C: [','],
      IF: ['I', 'I1'],
      I: ['i'],
      I1: ['I2', 'C4'],
      I2: ['f'],
      C4: ['PI', 'C5'],
      C5: ['L', 'C5.1'],
      'C5.1': ['RL', 'C6'],
      C6: ['OP', 'C7'],
      OP: /^(==|>|!=|<|>=|<=)$/.test(siguiente) ? [siguiente] : null,
      C7: /^\d+$/.test(siguiente) ? ['D', 'C7.1'] : /^[a-zA-Z]$/.test(siguiente) ? ['C7.2', 'C8'] : null,
      'C7.1': ['RD', 'C8'],
      C8: ['PF', 'C27'],
      'C7.2': ['L', 'RL'],
      C27: ['LLAI', 'C28'],
      LLAI: ['{'],
      C28: ['RE', 'CO'],
      RE: /^[r][e][t][u][r][n]$/,
      CO: /^[c][o][n][t][e][n][i][d][o]$/,
      C30: ['}']
  };

  return producciones[noTerminal] || null;
}




