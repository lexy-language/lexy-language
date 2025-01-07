import {tokenize} from "./tokenize";
import {MemberAccessLiteral} from "../../src/parser/tokens/memberAccessLiteral";
import {TokenType} from "../../src/parser/tokens/tokenType";

describe('MemberAccessTests', () => {
  it('TestTableHeader', async () => {
    tokenize("    Source.Member")
      .count(1)
      .type<MemberAccessLiteral>(0, TokenType.MemberAccessLiteral)
      .memberAccess(0, "Source.Member")
      .assert();
  });
});