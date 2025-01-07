import {tokenize} from "./tokenize";
import {TableSeparatorToken} from "../../src/parser/tokens/tableSeparatorToken";
import {TokenType} from "../../src/parser/tokens/tokenType";

describe('TableTests', () => {
  it('TestTableHeader', async () => {
    tokenize("  | int Value | string Result |")
      .count(7)
      .type<TableSeparatorToken>(0, TokenType.TableSeparatorToken)
      .stringLiteral(1, "int")
      .stringLiteral(2, "Value")
      .type<TableSeparatorToken>(3, TokenType.TableSeparatorToken)
      .stringLiteral(4, "string")
      .stringLiteral(5, "Result")
      .type<TableSeparatorToken>(6, TokenType.TableSeparatorToken)
      .assert();
  });

  it('TestTableRow', async () => {
    tokenize("  | 7 | 8 |")
      .count(5)
      .type<TableSeparatorToken>(0, TokenType.TableSeparatorToken)
      .numberLiteral(1, 7)
      .type<TableSeparatorToken>(2, TokenType.TableSeparatorToken)
      .numberLiteral(3, 8)
      .type<TableSeparatorToken>(4, TokenType.TableSeparatorToken)
      .assert();
  });
});