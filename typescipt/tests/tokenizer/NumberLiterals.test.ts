import {tokenize, tokenizeExpectError} from "./tokenize";
import {OperatorType} from "../../src/parser/tokens/operatorType";

describe('NumberLiteralsTests', () => {
  it('IntLiteral', async () => {
    tokenize("   0").count(1)
      .numberLiteral(0, 0)
      .assert();
  });

  it('Int3CharLiteral', async () => {
    tokenize("   456").count(1)
      .numberLiteral(0, 456)
      .assert();
  });

  it('NegativeIntLiteral', async () => {
    tokenize("   -456")
      .count(2)
      .operator(0, OperatorType.Subtraction)
      .numberLiteral(1, 456)
      .assert();
  });

  it('DecimalLiteral', async () => {
    tokenize("   456.78").count(1)
      .numberLiteral(0, 456.78)
      .assert();
  });

  it('NegativeDecimalLiteral', async () => {
    tokenize("   -456.78")
      .count(2)
      .operator(0, OperatorType.Subtraction)
      .numberLiteral(1, 456.78)
      .assert();
  });

  it('InvalidDecimalSubtract', async () => {
    tokenize("   456-78").count(3)
      .numberLiteral(0, 456)
      .operator(1, OperatorType.Subtraction)
      .numberLiteral(2, 78)
      .assert();
  });

  it('InvalidDecimalLiteral', async () => {
    let result = tokenizeExpectError("   456d78");
    expect(result.errorMessage).toBe("Invalid number token character: 'd'");
  });

  it('InvalidDecimalOpenParLiteral', async () => {
    let result = tokenizeExpectError("   456(78");
    expect(result.errorMessage).toBe("Invalid number token character: '('");
  });
});