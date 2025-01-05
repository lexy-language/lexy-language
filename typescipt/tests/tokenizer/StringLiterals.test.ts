import {tokenize} from "./tokenize";

describe('StringLiteralsTests', () => {
  it('TestQuotedLiteral', async () => {
    tokenize("   \"This is a quoted literal\"")
      .count(1)
      .quotedString(0, "This is a quoted literal")
      .assert();
  });

  it('TestStringLiteral', async () => {
    tokenize("   ThisIsAStringLiteral").count(1)
      .stringLiteral(0, "ThisIsAStringLiteral")
      .assert();
  });
});