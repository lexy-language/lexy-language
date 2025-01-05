import {buildDependencyGraph} from "./dependencyGraphExtensions";

describe('FactoryTests', () => {
  const enumDefinition = `Enum: SimpleEnum
  First
  Second
`;

  const table = `Table: SimpleTable
  | number Search | string Value |
  | 0 | "0" |
  | 1 | "1" |
  | 2 | "2" |
`;

  const functionCode = `Function: SimpleFunction
  Parameters
    number Value
  Results
    number Result
  Code
    Result = Value
`;

  it('simpleEnum', async () => {
    const dependencies = buildDependencyGraph(enumDefinition);
    expect(dependencies.nodes.length).toBe(1);
    expect(dependencies.nodes[0].name).toBe(`SimpleEnum`);
    expect(dependencies.nodes[0].type).toBe("EnumDefinition");
    expect(dependencies.nodes[0].dependencies.length).toBe(0);
  });

  it('simpleTable', async () => {
    const dependencies = buildDependencyGraph(table);
    expect(dependencies.nodes.length).toBe(1);
    expect(dependencies.nodes[0].name).toBe(`SimpleTable`);
    expect(dependencies.nodes[0].type).toBe("Table");
    expect(dependencies.nodes[0].dependencies.length).toBe(0);
  });

  it('simpleFunction', async () => {
    const dependencies = buildDependencyGraph(functionCode);
    expect(dependencies.nodes.length).toBe(1);
    expect(dependencies.nodes[0].name).toBe(`SimpleFunction`);
    expect(dependencies.nodes[0].type).toBe("Function");
    expect(dependencies.nodes[0].dependencies.length).toBe(0);
  });

  it('functionNewFunctionParameters', async () => {
    const dependencies = buildDependencyGraph(functionCode + `
Function: Caller
  Code
    var parameters = new(SimpleFunction.Parameters)
`);

    expect(dependencies.nodes.length).toBe(2);
    expect(dependencies.nodes[0].name).toBe(`SimpleFunction`);
    expect(dependencies.nodes[0].type).toBe("Function");
    expect(dependencies.nodes[0].dependencies.length).toBe(0);
    expect(dependencies.nodes[1].name).toBe(`Caller`);
    expect(dependencies.nodes[1].type).toBe("Function");
    expect(dependencies.nodes[1].dependencies.length).toBe(1);
    expect(dependencies.nodes[1].dependencies[0].name).toBe(`SimpleFunction`);
    expect(dependencies.nodes[1].dependencies[0].type).toBe("Function");
  });

  it('functionNewFunctionResults', async () => {
    const dependencies = buildDependencyGraph(functionCode + `
Function: Caller
  Code
    var parameters = new(SimpleFunction.Results)
`);

    expect(dependencies.nodes.length).toBe(2);
    expect(dependencies.nodes[0].name).toBe(`SimpleFunction`);
    expect(dependencies.nodes[0].type).toBe("Function");
    expect(dependencies.nodes[0].dependencies.length).toBe(0);
    expect(dependencies.nodes[1].name).toBe(`Caller`);
    expect(dependencies.nodes[1].type).toBe("Function");
    expect(dependencies.nodes[1].dependencies.length).toBe(1);
    expect(dependencies.nodes[1].dependencies[0].name).toBe(`SimpleFunction`);
    expect(dependencies.nodes[1].dependencies[0].type).toBe("Function");
  });

  it('functionFillFunctionParameters', async () => {
    const dependencies = buildDependencyGraph(functionCode + `
Function: Caller
  Parameters
    number Value
  Code
    var parameters = fill(SimpleFunction.Parameters)
`);

    expect(dependencies.nodes.length).toBe(2);
    expect(dependencies.nodes[0].name).toBe(`SimpleFunction`);
    expect(dependencies.nodes[0].type).toBe("Function");
    expect(dependencies.nodes[0].dependencies.length).toBe(0);
    expect(dependencies.nodes[1].name).toBe(`Caller`);
    expect(dependencies.nodes[1].type).toBe("Function");
    expect(dependencies.nodes[1].dependencies.length).toBe(1);
    expect(dependencies.nodes[1].dependencies[0].name).toBe(`SimpleFunction`);
    expect(dependencies.nodes[1].dependencies[0].type).toBe("Function");
  });

  it('functionFillFunctionResults', async () => {
    const dependencies = buildDependencyGraph(functionCode + `
Function: Caller
  Parameters
    number Result
  Code
    var parameters = fill(SimpleFunction.Results)
`);

    expect(dependencies.nodes.length).toBe(2);
    expect(dependencies.nodes[0].name).toBe(`SimpleFunction`);
    expect(dependencies.nodes[0].type).toBe("Function");
    expect(dependencies.nodes[0].dependencies.length).toBe(0);
    expect(dependencies.nodes[1].name).toBe(`Caller`);
    expect(dependencies.nodes[1].type).toBe("Function");
    expect(dependencies.nodes[1].dependencies.length).toBe(1);
    expect(dependencies.nodes[1].dependencies[0].name).toBe(`SimpleFunction`);
    expect(dependencies.nodes[1].dependencies[0].type).toBe("Function");
  });

  it('tableLookup', async () => {
    const dependencies = buildDependencyGraph(table + `
Function: Caller
  Code
    var result = LOOKUP(SimpleTable, 2, SimpleTable.Search, SimpleTable.Value)
`);

    expect(dependencies.nodes.length).toBe(2);
    expect(dependencies.nodes[0].name).toBe(`SimpleTable`);
    expect(dependencies.nodes[0].type).toBe("Table");
    expect(dependencies.nodes[0].dependencies.length).toBe(0);
    expect(dependencies.nodes[1].name).toBe(`Caller`);
    expect(dependencies.nodes[1].type).toBe("Function");
    expect(dependencies.nodes[1].dependencies.length).toBe(1);
    expect(dependencies.nodes[1].dependencies[0].name).toBe(`SimpleTable`);
    expect(dependencies.nodes[1].dependencies[0].type).toBe("Table");
  });

  it('SimpleScenario', async () => {
    const dependencies = buildDependencyGraph(functionCode + `

Scenario: Simple
  Function SimpleFunction
  Results
    Result = 2
  Parameters
    Value = 2
`);
    expect(dependencies.nodes.length).toBe(2);
    expect(dependencies.nodes[0].name).toBe(`SimpleFunction`);
    expect(dependencies.nodes[0].type).toBe("Function");
    expect(dependencies.nodes[0].dependencies.length).toBe(0);
    expect(dependencies.nodes[1].name).toBe(`Simple`);
    expect(dependencies.nodes[1].type).toBe("Scenario");
    expect(dependencies.nodes[1].dependencies.length).toBe(0);
  });

  it('simpleType', async () => {
    const dependencies = buildDependencyGraph(`
Type: Simple
  number Value1
  string Value2
`);
    expect(dependencies.nodes.length).toBe(1);
    expect(dependencies.nodes[0].name).toBe(`Simple`);
    expect(dependencies.nodes[0].type).toBe("TypeDefinition");
    expect(dependencies.nodes[0].dependencies.length).toBe(0);
  });

  it('complexType', async () => {
    const dependencies = buildDependencyGraph(`
Type: Inner
  number Value1
  string Value2

Type: Parent
  number Value1
  string Value2
  Inner Value3
`);
    expect(dependencies.nodes.length).toBe(2);
    expect(dependencies.nodes[0].name).toBe(`Inner`);
    expect(dependencies.nodes[0].type).toBe("TypeDefinition");
    expect(dependencies.nodes[0].dependencies.length).toBe(0);
    expect(dependencies.nodes[1].name).toBe(`Parent`);
    expect(dependencies.nodes[1].type).toBe("TypeDefinition");
    expect(dependencies.nodes[1].dependencies.length).toBe(1);
  });

  it('circularType', async () => {
    const dependencies = buildDependencyGraph(`
Type: Inner
  number Value1
  string Value2
  Parent Value3

Type: Parent
  number Value1
  string Value2
  Inner Value3
`, false);

    expect(dependencies.nodes.length).toBe(2);
    expect(dependencies.nodes[0].name).toBe(`Inner`);
    expect(dependencies.nodes[0].type).toBe("TypeDefinition");
    expect(dependencies.nodes[0].dependencies.length).toBe(1);
    expect(dependencies.nodes[1].name).toBe(`Parent`);
    expect(dependencies.nodes[1].type).toBe("TypeDefinition");
    expect(dependencies.nodes[1].dependencies.length).toBe(1);
    expect(dependencies.circularReferences.length).toBe(2);
    expect(dependencies.circularReferences[0].nodeName).toBe(`Inner`);
    expect(dependencies.circularReferences[1].nodeName).toBe(`Parent`);
  });

  it('circularFunctionCall', async () => {
    const dependencies = buildDependencyGraph(`
Function: Inner
  Code
    Parent()

Function: Parent
  Code
    Inner()
`, false);

    expect(dependencies.nodes.length).toBe(2);
    expect(dependencies.nodes[0].name).toBe(`Inner`);
    expect(dependencies.nodes[0].type).toBe("Function");
    expect(dependencies.nodes[0].dependencies.length).toBe(1);
    expect(dependencies.nodes[1].name).toBe(`Parent`);
    expect(dependencies.nodes[1].type).toBe("Function");
    expect(dependencies.nodes[1].dependencies.length).toBe(1);
    expect(dependencies.circularReferences.length).toBe(2);
    expect(dependencies.circularReferences[0].nodeName).toBe(`Inner`);
    expect(dependencies.circularReferences[1].nodeName).toBe(`Parent`);
  });
});
