import {parseExpression} from "./parseExpression";
import {asBinaryExpression, BinaryExpression} from "../../../src/language/expressions/binaryExpression";
import {ExpressionOperator} from "../../../src/language/expressions/expressionOperator";
import {validateOfType} from "../../validateOfType";
import {validateNumericLiteralExpression, validateVariableExpression} from "./expressionTestExtensions";


describe('BinaryExpressionTests', () => {
  it('addition', async () => {
     let expression = parseExpression(`B + C`);
     validateOfType<BinaryExpression>(asBinaryExpression, expression, addition => {
       expect(addition.operator).toBe(ExpressionOperator.Addition);
       validateVariableExpression(addition.left, `B`);
       validateVariableExpression(addition.right, `C`);
     });
   });

  it('subtraction', async () => {
     let expression = parseExpression(`B - C`);
     validateOfType<BinaryExpression>(asBinaryExpression, expression, addition => {
       expect(addition.operator).toBe(ExpressionOperator.Subtraction);
       validateVariableExpression(addition.left, `B`);
       validateVariableExpression(addition.right, `C`);
     });
   });

  it('additionAndMultiplication', async () => {
     let expression = parseExpression(`B + C * 12`);
     validateOfType<BinaryExpression>(asBinaryExpression, expression,addition => {
       expect(addition.operator).toBe(ExpressionOperator.Addition);
       validateVariableExpression(addition.left, `B`);
       validateOfType<BinaryExpression>(asBinaryExpression, addition.right, multiplication => {
         expect(multiplication.operator).toBe(ExpressionOperator.Multiplication);
         validateVariableExpression(multiplication.left, `C`);
         validateNumericLiteralExpression(multiplication.right, 12);
       });
     });
   });

  it('divisionTests', async () => {
     let expression = parseExpression(`B / 12`);
     validateOfType<BinaryExpression>(asBinaryExpression, expression,multiplication => {
       expect(multiplication.operator).toBe(ExpressionOperator.Division);
       validateVariableExpression(multiplication.left, `B`);
       validateNumericLiteralExpression(multiplication.right, 12);
     });
   });

  it('modulusTests', async () => {
     let expression = parseExpression(`B % 12`);
     validateOfType<BinaryExpression>(asBinaryExpression, expression,multiplication => {
       expect(multiplication.operator).toBe(ExpressionOperator.Modulus);
       validateVariableExpression(multiplication.left, `B`);
       validateNumericLiteralExpression(multiplication.right, 12);
     });
   });

  it('greaterThan', async () => {
     let expression = parseExpression(`B > 12`);

     validateOfType<BinaryExpression>(asBinaryExpression, expression,multiplication => {
       expect(multiplication.operator).toBe(ExpressionOperator.GreaterThan);
       validateVariableExpression(multiplication.left, `B`);
       validateNumericLiteralExpression(multiplication.right, 12);
     });
   });

  it('greaterThanOrEqual', async () => {
     let expression = parseExpression(`B >= 12`);

     validateOfType<BinaryExpression>(asBinaryExpression, expression,multiplication => {
       expect(multiplication.operator).toBe(ExpressionOperator.GreaterThanOrEqual);
       validateVariableExpression(multiplication.left, `B`);
       validateNumericLiteralExpression(multiplication.right, 12);
     });
   });

  it('lessThan', async () => {
     let expression = parseExpression(`B < 12`);

     validateOfType<BinaryExpression>(asBinaryExpression, expression,multiplication => {
       expect(multiplication.operator).toBe(ExpressionOperator.LessThan);
       validateVariableExpression(multiplication.left, `B`);
       validateNumericLiteralExpression(multiplication.right, 12);
     });
   });

  it('lessThanOrEqual', async () => {
     let expression = parseExpression(`B <= 12`);

     validateOfType<BinaryExpression>(asBinaryExpression, expression,multiplication => {
       expect(multiplication.operator).toBe(ExpressionOperator.LessThanOrEqual);
       validateVariableExpression(multiplication.left, `B`);
       validateNumericLiteralExpression(multiplication.right, 12);
     });
   });

  it('equals', async () => {
     let expression = parseExpression(`B == 12`);

     validateOfType<BinaryExpression>(asBinaryExpression, expression,multiplication => {
       expect(multiplication.operator).toBe(ExpressionOperator.Equals);
       validateVariableExpression(multiplication.left, `B`);
       validateNumericLiteralExpression(multiplication.right, 12);
     });
   });

  it('notEqual', async () => {
     let expression = parseExpression(`B != 12`);

     validateOfType<BinaryExpression>(asBinaryExpression, expression,multiplication => {
       expect(multiplication.operator).toBe(ExpressionOperator.NotEqual);
       validateVariableExpression(multiplication.left, `B`);
       validateNumericLiteralExpression(multiplication.right, 12);
     });
   });

  it('and', async () => {
     let expression = parseExpression(`B && 12`);

     validateOfType<BinaryExpression>(asBinaryExpression, expression,multiplication => {
       expect(multiplication.operator).toBe(ExpressionOperator.And);
       validateVariableExpression(multiplication.left, `B`);
       validateNumericLiteralExpression(multiplication.right, 12);
     });
   });

  it('or', async () => {
     let expression = parseExpression(`B || 12`);

     validateOfType<BinaryExpression>(asBinaryExpression, expression,multiplication => {
       expect(multiplication.operator).toBe(ExpressionOperator.Or);
       validateVariableExpression(multiplication.left, `B`);
       validateNumericLiteralExpression(multiplication.right, 12);
     });
   });
});
