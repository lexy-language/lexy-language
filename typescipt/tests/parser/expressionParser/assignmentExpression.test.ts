import {validateOfType} from "../../validateOfType";
import {asAssignmentExpression, AssignmentExpression} from "../../../src/language/expressions/assignmentExpression";
import {asBinaryExpression, BinaryExpression} from "../../../src/language/expressions/binaryExpression";
import {ExpressionOperator} from "../../../src/language/expressions/expressionOperator";
import {
  validateIdentifierExpression,
  validateNumericLiteralExpression,
  validateVariableExpression
} from "./expressionTestExtensions";
import {parseExpression} from "./parseExpression";

describe('AssignmentExpressionTests', () => {
  it('addition', async () => {
    let expression = parseExpression(`A = B + C`);
    validateOfType<AssignmentExpression>(asAssignmentExpression, expression, assignmentExpression => {
      validateIdentifierExpression(assignmentExpression.variable, `A`);
      validateOfType<BinaryExpression>(asBinaryExpression, assignmentExpression.assignment, addition => {
        expect(addition.operator).toBe(ExpressionOperator.Addition);
        validateVariableExpression(addition.left, `B`);
        validateVariableExpression(addition.right, `C`);
      });
    });
  });

  it('additionAndMultiplication', async () => {
    let expression = parseExpression(`A = B + C * 12`);
    validateOfType<AssignmentExpression>(asAssignmentExpression, expression, assignment => {
      validateIdentifierExpression(assignment.variable, `A`);
      validateOfType<BinaryExpression>(asBinaryExpression, assignment.assignment, addition => {
        expect(addition.operator).toBe(ExpressionOperator.Addition);
        validateVariableExpression(addition.left, `B`);
        validateOfType<BinaryExpression>(asBinaryExpression, addition.right, multiplication => {
          expect(multiplication.operator).toBe(ExpressionOperator.Multiplication);
          validateVariableExpression(multiplication.left, `C`);
          validateNumericLiteralExpression(multiplication.right, 12);
        });
      });
    });
  });
});