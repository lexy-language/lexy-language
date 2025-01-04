import {parseExpression} from "./parseExpression";
import {validateIdentifierExpression, validateNumericLiteralExpression} from "./expressionTestExtensions";
import {ExpressionOperator} from "../../../src/language/expressions/expressionOperator";
import {validateOfType} from "../../validateOfType";
import {asBinaryExpression, BinaryExpression} from "../../../src/language/expressions/binaryExpression";
import {asAssignmentExpression, AssignmentExpression} from "../../../src/language/expressions/assignmentExpression";
import {
  asFunctionCallExpression,
  FunctionCallExpression
} from "../../../src/language/expressions/functionCallExpression";

describe('LiteralExpressionTests', () => {
  it('number', async () => {
    let expression = parseExpression(`456`);
    validateNumericLiteralExpression(expression, 456);
   });

  it('negativeNumber', async () => {
     let expression = parseExpression(`-456`);
    validateNumericLiteralExpression(expression, -456);
   });

  it('subtraction', async () => {
     let expression = parseExpression(`789-456`);
     validateOfType<BinaryExpression>(asBinaryExpression, expression, expression => {
       expect(expression.operator).toBe(ExpressionOperator.Subtraction);
       validateNumericLiteralExpression(expression.left, 789);
       validateNumericLiteralExpression(expression.right, 456);
     });
   });

  it('doubleSubtraction', async () => {
     let expression = parseExpression(`789 - -456`);
     validateOfType<BinaryExpression>(asBinaryExpression, expression, subtraction => {
       expect(subtraction.operator).toBe(ExpressionOperator.Subtraction);
       validateNumericLiteralExpression(subtraction.left, 789);
       validateNumericLiteralExpression(subtraction.right, -456);
     });
   });

  it('doubleSubtractionWithSpace', async () => {
     let expression = parseExpression(`789 - -456`);
     validateOfType<BinaryExpression>(asBinaryExpression, expression, subtraction => {
       expect(subtraction.operator).toBe(ExpressionOperator.Subtraction);
       validateNumericLiteralExpression(subtraction.left, 789);
       validateNumericLiteralExpression(subtraction.right, -456);
     });
   });

  it('functionCallWithNegativeNumber', async () => {
     let expression = parseExpression(`Result = ABS(-2)`);
     validateOfType<AssignmentExpression>(asAssignmentExpression, expression, assignment => {
       validateIdentifierExpression(assignment.variable, `Result`);
       validateOfType<FunctionCallExpression>(asFunctionCallExpression, assignment.assignment, functionCall => {
         expect(functionCall.functionName).toBe(`ABS`);
         expect(functionCall.arguments.length).toBe(1);
         validateNumericLiteralExpression(functionCall.arguments[0], -2);
       });
     });
   });
});
