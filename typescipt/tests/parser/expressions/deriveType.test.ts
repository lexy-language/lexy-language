import {PrimitiveType} from "../../../src/language/variableTypes/primitiveType";
import {VariableType} from "../../../src/language/variableTypes/variableType";
import {SourceReference} from "../../../src/parser/sourceReference";
import {SourceFile} from "../../../src/parser/sourceFile";
import {IValidationContext, ValidationContext} from "../../../src/parser/validationContext";
import {VariableSource} from "../../../src/language/variableSource";
import {parseExpression} from "../expressionParser/parseExpression";
import {RootNodeList} from "../../../src/language/rootNodeList";
import {ParserLogger} from "../../../src/parser/parserLogger";
import {ConsoleLogger} from "../../../src/parser/logger";

describe('DeriveTypeTests', () => {
  it('numberLiteral', async () => {
    const type = deriveType(`5`);
    expect(type).toBe(PrimitiveType.number);
  });

  it('stringLiteral', async () => {
    const type = deriveType(`"abc"`);
    expect(type).toBe(PrimitiveType.string);
  });

  it('booleanLiteral', async () => {
    const type = deriveType(`true`);
    expect(type).toBe(PrimitiveType.boolean);
  });

  it('booleanLiteralFalse', async () => {
    const type = deriveType(`false`);
    expect(type).toBe(PrimitiveType.boolean);
  });

  it('dateTimeLiteral', async () => {
    const type = deriveType(`d"2024-12-24T10:05:00"`);
    expect(type).toBe(PrimitiveType.date);
  });

  it('numberCalculationLiteral', async () => {
    const type = deriveType(`5 + 5`);
    expect(type).toBe(PrimitiveType.number);
  });

  it('stringConcatLiteral', async () => {
    const type = deriveType(`"abc" + "def"`);
    expect(type).toBe(PrimitiveType.string);
  });

  it('booleanLogicalLiteral', async () => {
    const type = deriveType(`true && false`);
    expect(type).toBe(PrimitiveType.boolean);
  });

  it('stringVariable', async () => {
    const type = deriveType(`a`, context => {
      context.variableContext.registerVariableAndVerifyUnique(newReference(), `a`, PrimitiveType.string,
        VariableSource.Results);
    });

    expect(type).toBe(PrimitiveType.string);
  });

  it('numberVariable', async () => {
    const type = deriveType(`a`, context => {
      context.variableContext.registerVariableAndVerifyUnique(newReference(), `a`, PrimitiveType.number,
        VariableSource.Results);
    });
    expect(type).toBe(PrimitiveType.number);
  });

  it('booleanVariable', async () => {
    const type = deriveType(`a`, context => {
      context.variableContext.registerVariableAndVerifyUnique(newReference(), `a`, PrimitiveType.boolean,
        VariableSource.Results);
    });
    expect(type).toBe(PrimitiveType.boolean);
  });

  it('dateTimeVariable', async () => {
    const type = deriveType(`a`, context => {
      context.variableContext.registerVariableAndVerifyUnique(newReference(), `a`, PrimitiveType.date,
        VariableSource.Results);
    });
    expect(type).toBe(PrimitiveType.date);
  });

  it('stringVariableConcat', async () => {
    const type = deriveType(`a + "bc"`, context => {
      context.variableContext.registerVariableAndVerifyUnique(newReference(), `a`, PrimitiveType.string,
        VariableSource.Results);
    });
    expect(type).toBe(PrimitiveType.string);
  });

  it('numberVariableCalculation', async () => {
    const type = deriveType(`a + 20`, context => {
      context.variableContext.registerVariableAndVerifyUnique(newReference(), `a`, PrimitiveType.number,
        VariableSource.Results);
    });
    expect(type).toBe(PrimitiveType.number);
  });

  it('numberVariableWithParenthesisCalculation', async () => {
    const type = deriveType(`(a + 20.05) * 3`, context => {
      context.variableContext.registerVariableAndVerifyUnique(newReference(), `a`, PrimitiveType.number,
        VariableSource.Results);
    });
    expect(type).toBe(PrimitiveType.number);
  });

  function newReference() {
    return new SourceReference(new SourceFile(`tests.lexy`), 1, 1);
  }

  function deriveType(expressionValue: string,
                      validationContextHandler: ((context: IValidationContext) => void) | null = null): VariableType | null {

    const rootNodeList = new RootNodeList();
    const logger = new ParserLogger(new ConsoleLogger());
    const validationContext = new ValidationContext(logger, rootNodeList);

    const scope = validationContext.createVariableScope();
    try {
      if (validationContextHandler) validationContextHandler(validationContext);

      let expression = parseExpression(expressionValue);
      return expression.deriveType(validationContext);
    } finally {
      scope[Symbol.dispose]();
    }
  }
});
