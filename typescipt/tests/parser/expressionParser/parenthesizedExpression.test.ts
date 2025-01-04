import {parseExpression, parseExpressionExpectException} from "./parseExpression";
import {validateOfType} from "../../validateOfType";
import {
  asParenthesizedExpression,
  ParenthesizedExpression
} from "../../../src/language/expressions/parenthesizedExpression";
import {validateVariableExpression} from "./expressionTestExtensions";
import {asBinaryExpression, BinaryExpression} from "../../../src/language/expressions/binaryExpression";
import {ExpressionOperator} from "../../../src/language/expressions/expressionOperator";

describe('ParenthesizedExpressionTests', () => {
  it('parenthesizedExpression', async () => {
     let expression = parseExpression(`(A)`);
     validateOfType<ParenthesizedExpression>(asParenthesizedExpression, expression, parenthesized =>
       validateVariableExpression(parenthesized.expression, `A`));
   });

  it('nestedParenthesizedExpression', async () => {
     let expression = parseExpression(`(5 * (3 + A))`);
     validateOfType<ParenthesizedExpression>(asParenthesizedExpression, expression, parenthesis =>
       validateOfType<BinaryExpression>(asBinaryExpression, parenthesis.expression, multiplication =>
         validateOfType<ParenthesizedExpression>(asParenthesizedExpression, multiplication.right, inner =>
           validateOfType<BinaryExpression>(asBinaryExpression, inner.expression, addition =>
             expect(addition.operator).toBe(ExpressionOperator.Addition)))));
   });

  it('invalidParenthesizedExpression', async () => {
     parseExpressionExpectException(
       `(A`,
       `(ParenthesizedExpression) No closing parentheses found.`);
   });

  it('invalidNestedParenthesizedExpression', async () => {
     parseExpressionExpectException(
       `(5 * (3 + A)`,
       `(ParenthesizedExpression) No closing parentheses found.`);
   });
});
