import {parseExpression, parseExpressionExpectException} from "./parseExpression";
import {validateOfType} from "../../validateOfType";
import {
  asFunctionCallExpression,
  FunctionCallExpression
} from "../../../src/language/expressions/functionCallExpression";
import {asIntFunction, IntFunction} from "../../../src/language/expressions/functions/intFunction";
import {
  validateIdentifierExpression,
  validateNumericLiteralExpression,
  validateVariableExpression
} from "./expressionTestExtensions";
import {asBinaryExpression, BinaryExpression} from "../../../src/language/expressions/binaryExpression";
import {
  asParenthesizedExpression,
  ParenthesizedExpression
} from "../../../src/language/expressions/parenthesizedExpression";
import {ExpressionOperator} from "../../../src/language/expressions/expressionOperator";

describe('FunctionCallExpressionTests', () => {
  it('functionCallExpression', async () => {
     let expression = parseExpression(`INT(y)`);
     validateOfType<FunctionCallExpression>(asFunctionCallExpression, expression, functionCallExpression => {
       expect(functionCallExpression.functionName).toBe(`INT`);
       validateOfType<IntFunction>(asIntFunction, functionCallExpression.expressionFunction, functionExpression =>
         validateVariableExpression(functionExpression.valueExpression, `y`));
     });
   });

  it('nestedParenthesizedExpression', async () => {
     let expression = parseExpression(`INT(5 * (3 + A))`);
     validateOfType<FunctionCallExpression>(asFunctionCallExpression, expression, functionCall => {
       expect(functionCall.functionName).toBe(`INT`);
       validateOfType<IntFunction>(asIntFunction, functionCall.expressionFunction, functionExpression =>
         validateOfType<BinaryExpression>(asBinaryExpression, functionExpression.valueExpression, multiplication =>
           validateOfType<ParenthesizedExpression>(asParenthesizedExpression, multiplication.right, inner =>
             validateOfType<BinaryExpression>(asBinaryExpression, inner.expression, addition =>
               expect(addition.operator).toBe(ExpressionOperator.Addition)))));
     });
   });

  it('nestedParenthesizedMultipleArguments', async () => {
     let expression = parseExpression(`ROUND(POWER(98.6,3.2),3)`);
     validateOfType<FunctionCallExpression>(asFunctionCallExpression, expression, round => {
       expect(round.functionName).toBe(`ROUND`);
       expect(round.arguments.length).toBe(2);
       validateOfType<FunctionCallExpression>( asFunctionCallExpression, round.arguments[0], power => {
         expect(power.arguments.length).toBe(2);
         validateNumericLiteralExpression(power.arguments[0], 98.6);
         validateNumericLiteralExpression(power.arguments[1], 3.2);
       });
       validateNumericLiteralExpression(round.arguments[1], 3);
     });
   });

  it('callExtract', async () => {
     let expression = parseExpression(`extract(results)`);
     validateOfType<FunctionCallExpression>(asFunctionCallExpression, expression, round => {
       expect(round.functionName).toBe(`extract`);
       expect(round.arguments.length).toBe(1);
       validateIdentifierExpression(round.arguments[0], `results`);
     });
   });

  it('invalidParenthesizedExpression', async () => {
     parseExpressionExpectException(
       `func(A`,
       `(FunctionCallExpression) No closing parentheses found.`);
   });

  it('invalidNestedParenthesizedExpression', async () => {
     parseExpressionExpectException(
       `func(5 * (3 + A)`,
       `(FunctionCallExpression) No closing parentheses found.`);
   });
});
