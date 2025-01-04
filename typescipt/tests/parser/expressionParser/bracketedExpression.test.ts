import {parseExpression, parseExpressionExpectException} from "./parseExpression";
import {validateOfType} from "../../validateOfType";
import {asBracketedExpression, BracketedExpression} from "../../../src/language/expressions/bracketedExpression";
import {validateVariableExpression} from "./expressionTestExtensions";
import {asBinaryExpression, BinaryExpression} from "../../../src/language/expressions/binaryExpression";
import {ExpressionOperator} from "../../../src/language/expressions/expressionOperator";
import {
  asParenthesizedExpression,
  ParenthesizedExpression
} from "../../../src/language/expressions/parenthesizedExpression";

describe('BracketedExpressionTests', () => {
  it('functionCallExpression', async () => {
     let expression = parseExpression(`func[y]`);
     validateOfType<BracketedExpression>(asBracketedExpression, expression, functionCallExpression => {
       expect(functionCallExpression.functionName).toBe(`func`);
       validateVariableExpression(functionCallExpression.expression, `y`);
     });
   });

  it('nestedParenthesizedExpression', async () => {
     let expression = parseExpression(`func[5 * (3 + A)]`);
     validateOfType<BracketedExpression>(asBracketedExpression, expression, functionCall => {
       expect(functionCall.functionName).toBe(`func`);
       validateOfType<BinaryExpression>(asBinaryExpression, functionCall.expression, multiplication => {
         expect(multiplication.operator).toBe(ExpressionOperator.Multiplication);
         validateOfType<ParenthesizedExpression>(asParenthesizedExpression, multiplication.right, inner =>
           validateOfType<BinaryExpression>(asBinaryExpression, inner.expression, addition =>
             expect(addition.operator).toBe(ExpressionOperator.Addition)));
       });
     });
   });

  it('invalidParenthesizedExpression', async () => {
     parseExpressionExpectException(
       `func[A`,
       `(BracketedExpression) No closing bracket found.`);
   });

  it('invalidNestedParenthesizedExpression', async () => {
     parseExpressionExpectException(
       `func[5 * [3 + A]`,
       `(BracketedExpression) No closing bracket found.`);
   });
});
