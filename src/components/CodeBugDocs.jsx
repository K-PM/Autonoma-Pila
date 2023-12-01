import CodeCard from "./CodeCard";

function CodeBugDocs() {
  const ExamplesCodes = [
    {
      title: "Funcion",
      content: [
        {
          subtitle: "Funcion con retorno (opcion 1)",
          code: `fc suma ( param, param ) int {\n\treturn contenido\n}`,
        },
      ],
    },
    {
      title: "Declaracion variables",
      content: [
        {
          subtitle: "",
          code: `variable:20`,
        },
      ],
    },
    {
      title: "Declaracion del ciclo For",
      content: [
        {
          subtitle: "",
          code: `for i; j; 1++ {\n\treturn contenido\n}`,
        },
      ],
    },
    {
      title: "Declaración de estructuras de control",
      content: [
        {
          subtitle: "Metodo unico",
          code: `if ( x>b ) {\n\treturn contenido\n}`,
        },
      ],
    },
  ];

  return (
    <>
      <div>
        <div>
          {ExamplesCodes.map((example, index) => {
            return (
              <CodeCard
                key={index}
                title={example.title}
                content={example.content}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default CodeBugDocs;
