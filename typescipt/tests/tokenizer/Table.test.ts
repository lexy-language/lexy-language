import {tokenize} from "./tokenize";
import {TableSeparatorToken} from "../../src/parser/tokens/tableSeparatorToken";

describe('TableTests', () => {
  it('TestTableHeader', async () => {
    tokenize("  | int Value | string Result |")
      .count(7)
      .type<TableSeparatorToken>(0, TableSeparatorToken)
      .stringLiteral(1, "int")
      .stringLiteral(2, "Value")
      .type<TableSeparatorToken>(3, TableSeparatorToken)
      .stringLiteral(4, "string")
      .stringLiteral(5, "Result")
      .type<TableSeparatorToken>(6, TableSeparatorToken)
      .assert();
  });

  it('TestTableRow', async () => {
    tokenize("  | 7 | 8 |")
      .count(5)
      .type<TableSeparatorToken>(0, TableSeparatorToken)
      .numberLiteral(1, 7)
      .type<TableSeparatorToken>(2, TableSeparatorToken)
      .numberLiteral(3, 8)
      .type<TableSeparatorToken>(4, TableSeparatorToken)
      .assert();
  });
});