import {parseExpression} from "./parseExpression";
import {validateOfType} from "../../validateOfType";
import {asBinaryExpression, BinaryExpression} from "../../../src/language/expressions/binaryExpression";
import {ExpressionOperator} from "../../../src/language/expressions/expressionOperator";
import {validateVariableExpression} from "./expressionTestExtensions";

describe('OperationOrderTests', () => {
  it('addAndMultiply', async () => {
    let expression = parseExpression(`a + b * c`);
    validateOfType<BinaryExpression>(asBinaryExpression, expression, add => {
      expect(add.operator).toBe(ExpressionOperator.Addition);
      validateVariableExpression(add.left, `a`);
      validateOfType<BinaryExpression>(asBinaryExpression, add.right, multiplication => {
        expect(multiplication.operator).toBe(ExpressionOperator.Multiplication);
        validateVariableExpression(multiplication.left, `b`);
        validateVariableExpression(multiplication.right, `c`);
      });
    });
  });

  it('addAndMultiplyReverse', async () => {
    let expression = parseExpression(`a * b + c`);
    validateOfType<BinaryExpression>(asBinaryExpression, expression, add => {
      expect(add.operator).toBe(ExpressionOperator.Addition);
      validateOfType<BinaryExpression>(asBinaryExpression, add.left, expression => {
        expect(expression.operator).toBe(ExpressionOperator.Multiplication);
        validateVariableExpression(expression.left, `a`);
        validateVariableExpression(expression.right, `b`);
      });
      validateVariableExpression(add.right, `c`);
    });
  });

  it('andAndOr', async () => {
    let expression = parseExpression(`a && b || c`);
    validateOfType<BinaryExpression>(asBinaryExpression, expression, add => {
      expect(add.operator).toBe(ExpressionOperator.Or);
      validateOfType<BinaryExpression>(asBinaryExpression, add.left, expression => {
        expect(expression.operator).toBe(ExpressionOperator.And);
        validateVariableExpression(expression.left, `a`);
        validateVariableExpression(expression.right, `b`);
      });
      validateVariableExpression(add.right, `c`);
    });
  });

  it('orAndAn', async () => {
    let expression = parseExpression(`a || b && c`);
    validateOfType<BinaryExpression>(asBinaryExpression, expression, add => {
      expect(add.operator).toBe(ExpressionOperator.Or);
      validateVariableExpression(add.left, `a`);
      validateOfType<BinaryExpression>(asBinaryExpression, add.right, expression => {
        expect(expression.operator).toBe(ExpressionOperator.And);
        validateVariableExpression(expression.left, `b`);
        validateVariableExpression(expression.right, `c`);
      });
    });
  });
});
