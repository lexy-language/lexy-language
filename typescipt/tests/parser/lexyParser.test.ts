import {parseFunction} from "../parseFunctions";
import {validateOfType} from "../validateOfType";
import {
  asPrimitiveVariableDeclarationType,
  PrimitiveVariableDeclarationType
} from "../../src/language/variableTypes/primitiveVariableDeclarationType";

describe('LexyParserTests', () => {
  it('testSimpleReturn', async () => {
    const code = `Function: TestSimpleReturn
  Results
    number Result
  Code
    Result = 777`;

    const {functionNode} = parseFunction(code);

    expect(functionNode.name.value).toBe(`TestSimpleReturn`);
    expect(functionNode.results.variables.length).toBe(1);
    expect(functionNode.results.variables[0].name).toBe(`Result`);
    validateOfType<PrimitiveVariableDeclarationType>(asPrimitiveVariableDeclarationType,
      functionNode.results.variables[0].type, type =>
        expect(type.type).toBe(`number`));
    expect(functionNode.code.expressions.length).toBe(1);
    expect(functionNode.code.expressions[0].toString()).toBe(`Result=777`);
  });

  it('testFunctionKeywords', async () => {
    const code = `Function: ValidateFunctionKeywords
# Validate function keywords
  Parameters
  Results
  Code`;

    const {logger} = parseFunction(code);
    expect(logger.hasErrors()).toBe(false);
  });
});
