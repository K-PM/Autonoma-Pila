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


  // PARA LA FUNCION

  case 'F':
    return ['f'];   
  case 'F1':
    return ['c'];    
  case 'FUNC':
    return ['F', 'C20'];      
  case 'C20':
    return ['F1', 'C20.1'];
  case 'C20.1':
    return ['L', 'C20.2'];
  case 'C20.2':
    return ['RL', 'C21'];
  case 'C21':
    return ['PI', 'C22'];
  case 'C22':
    return ['L', 'C22.1'];
  case 'C22.1':
    return ['RL', 'C23'];
    case 'C23':
      return ['C','C24']
    case 'C24':
      return ['L', 'C24.1'];
    case 'C24.1':
        return ['RL', 'C25']
    case 'C25':
        return ['PF', 'C26'];
  case 'C26': 
    return ['T'];

  case 'T':
    if (siguiente === 'i') {
      console.log(siguiente)
      return ['INT', 'INT1'];
    }else if (siguiente === 'f') {
      console.log(siguiente)
      return ['FLO', 'FLO1'];
    }else if (siguiente === 's') {
      console.log(siguiente)
      return ['STR', 'STR1'];
    }else if (siguiente === 'b') {
      console.log(siguiente)
      return ['BO', 'BO1'];
    }
    else {
      return null;
    } 
//---- BOOLEAN
    case 'BO':
      return ['b']
    case 'BO1':
      return ['BO2','BO3']
    case 'BO3':
      return ['BO4','BO5']
    case 'BO5':
      return ['BO6','BO7']
    case 'BO7':
      return ['BO8','BO9']
    case 'BO9':
      return ['BO10','BO11']
    case 'BO11':
      return ['BO12','C27']
    case 'BO2':
      return ['o']
    case 'BO4':
      return ['o']
    case 'BO6':
      return ['l']
    case 'BO8':
      return ['e']
    case 'BO10':
      return ['a']
    case 'BO12':
      return ['n']
//---- STRING
  case 'STR':
    return ['s']
  case 'STR1':
    return ['STR2','STR3']
  case 'STR3':
    return ['STR4','STR5']
  case 'STR5':
    return ['STR6','STR7']
  case 'STR7':
    return ['STR8','STR9']
  case 'STR9':
    return ['STR10','C27']
  case 'STR2':
    return ['t']
  case 'STR4':
    return ['r']
  case 'STR6':
    return ['i']
  case 'STR8':
    return ['n']
  case 'STR10':
    return ['g']
//---- FLOAT
  case 'FLO':
    return ['f']
  case 'FLO1':
    return ['FLO2','FLO3']
  case 'FLO3':
    return ['FLO4','FLO5']
  case 'FLO5':
    return ['FLO6','FLO7']
  case 'FLO7':
    return ['FLO8','C27']
  case 'FLO2':
      return ['l']
  case 'FLO4':
      return ['o']  
  case 'FLO6':
      return ['a']
  case 'FLO8':
      return ['t'] 
//---- INT
  case 'INT':
    return ['i']
  case 'INT1':
    return ['INT2','INT3']
  case 'INT2':
    return ['n']
  case 'INT3':
    return ['INT4','C27']
  case 'INT4':
    return ['t']
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
  
case 'FOR':
return ['FOR1', 'FOR2']
case 'FOR1':
return ['f']
case 'FOR2':
return ['FOR3', 'FOR4']
case 'FOR3':
return ['o']
case 'FOR4':
return ['FOR5', 'C12']
case 'FOR5':
return ['r']
case 'C12':
if (/[a-z]/i.test(siguiente)) {
  return ['L', 'C12.1'];
} else if (/\d/.test(siguiente)) {
  return ['D', 'C12.2'];
} else {
  return null;
}        
case 'C12.1':
return ['RL', 'C13']
case 'C13':
return ['PC', 'C14']
case  'C14':
  if (/[a-z]/i.test(siguiente)) {
    return ['L', 'C14.1'];
  } else if (/\d/.test(siguiente)) {
    return ['D', 'C14.2'];
  } else {
    return null;
  }
case 'C14.1':
return ['RL', 'C15']
case 'C14.2':
return ['RD' ,'C15']
case 'C15':
return ['PC', 'C16']

case 'C16':
if (/[a-z]/i.test(siguiente)) {
  return ['L', 'C16.1'];
} else if (/\d/.test(siguiente)) {
  return ['D', 'C16.2'];
} else {
  return null;
}
case 'C16.1':
return ['RL','ITE']
case 'C16.2':
return ['RD','ITE']
case 'ITE':
  return ['SU', 'SU1'];

case 'C12.2':
return ['RD', 'C13']


case 'SU':
return ['+']
case 'SU1':
  return ['SU2', 'C27'];
case 'SU2':
  return ['+'];

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
