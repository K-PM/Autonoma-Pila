import CodeCard from "./CodeCard";

function CodeBugDocs() {
  const ExamplesCodes = [
    {
      title: "Gramatica 3",
      content: [
        {
          subtitle: "Cadena",
          code: `{ var int hola = takeData() }`,
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
