import {tokenize} from "./tokenize";

describe('ParametersTests', () => {
  it('TestParameterDeclaration', async () => {
    tokenize("  number Result")
      .count(2)
      .stringLiteral(0, "number")
      .stringLiteral(1, "Result")
      .assert();
  });
});