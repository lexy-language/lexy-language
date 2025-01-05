import {tokenize} from "./tokenize";

describe('TypeLiteralsTests', () => {
  it('TestIntTypeLiteral', async () => {
    tokenize("   int Value")
      .count(2)
      .stringLiteral(0, "int")
      .stringLiteral(1, "Value")
      .assert();
  });

  it('TestNumberTypeLiteral', async () => {
    tokenize("   number Value")
      .count(2)
      .stringLiteral(0, "number")
      .stringLiteral(1, "Value")
      .assert();
  });

  it('TestStringTypeLiteral', async () => {
    tokenize("   string Value")
      .count(2)
      .stringLiteral(0, "string")
      .stringLiteral(1, "Value")
      .assert();
  });

  it('TestDateTimeTypeLiteral', async () => {
    tokenize("   date Value")
      .count(2)
      .stringLiteral(0, "date")
      .stringLiteral(1, "Value")
      .assert();
  });

  it('TestBooleanTypeLiteral', async () => {
    tokenize("   boolean Value")
      .count(2)
      .stringLiteral(0, "boolean")
      .stringLiteral(1, "Value")
      .assert();
  });
});