import {Expression} from "../../../src/language/expressions/expression";
import {ExpressionFactory} from "../../../src/language/expressions/expressionFactory";
import {Line} from "../../../src/parser/line";
import {SourceFile} from "../../../src/parser/sourceFile";
import {Tokenizer} from "../../../src/parser/tokens/tokenizer";
import {expectSuccess} from "../../parserExtensions";

export function parseExpression(expression: string): Expression {

  const expressionFactory = new ExpressionFactory();
  const tokenizer = new Tokenizer();
  const sourceFile = new SourceFile(`tests.lexy`);
  const line = new Line(0, expression, sourceFile);

  const tokens = line.tokenize(tokenizer);
  if (tokens.state != 'success') {
    throw new Error(`Tokenizing failed: ${tokens.errorMessage}`);
  }

  const result = expressionFactory.parse(line.tokens, line);
  const value = expectSuccess(result);
  return value;
}

export function parseExpressionExpectException(expression: string, errorMessage: string) {

  const expressionFactory = new ExpressionFactory();
  const tokenizer = new Tokenizer();
  const sourceFile = new SourceFile(`tests.lexy`);
  const line = new Line(0, expression, sourceFile);

  let tokens = line.tokenize(tokenizer);
  if (tokens.state != 'success') {
    throw new Error(`Tokenizing failed: ${tokens.errorMessage}`);
  }

  const result = expressionFactory.parse(line.tokens, line);
  if (result.state != "failed") {
    throw new Error("result.state should be failed but is success")
  }
  expect(result.errorMessage).toBe(errorMessage);
}