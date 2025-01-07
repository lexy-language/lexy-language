import {parseNodes} from "../../parseFunctions";
import {validateOfType} from "../../validateOfType";
import {asIfExpression, IfExpression} from "../../../src/language/expressions/ifExpression";
import {asAssignmentExpression, AssignmentExpression} from "../../../src/language/expressions/assignmentExpression";

describe('IfExpressionTests', () => {
  it('checkIfStatement', async () => {
    const code = `Function: If
  Parameters
    boolean Evil
  Results
    number Number
  Code
    number temp = 777
    if Evil
      temp = 666
    Number = temp`;

    const {nodes, logger} = parseNodes(code);

    logger.assertNoErrors();

    const functionNode = nodes.getFunction("If");
    expect(functionNode).not.toBeNull();
    expect(functionNode?.code.expressions.length).toBe(3);
    validateOfType<IfExpression>(asIfExpression, functionNode?.code.expressions[1], expression => {
      expect(expression.trueExpressions.length).toBe(1);
      validateOfType<AssignmentExpression>(asAssignmentExpression, expression.trueExpressions[0], assgnment =>
        expect(assgnment.toString()).toBe("temp=666"));
    });
  });
});