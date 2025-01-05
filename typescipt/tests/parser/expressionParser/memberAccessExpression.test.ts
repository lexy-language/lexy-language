import {parseExpression} from "./parseExpression";
import {asAssignmentExpression, AssignmentExpression} from "../../../src/language/expressions/assignmentExpression";
import {validateOfType} from "../../validateOfType";
import {validateIdentifierExpression} from "./expressionTestExtensions";
import {
  asMemberAccessExpression,
  MemberAccessExpression
} from "../../../src/language/expressions/memberAccessExpression";

describe('MemberAccessExpressionTests', () => {
  it('simpleMemberAccess', async () => {
    let expression = parseExpression(`A = B.C`);
    validateOfType<AssignmentExpression>(asAssignmentExpression, expression, assignmentExpression => {
      validateIdentifierExpression(assignmentExpression.variable, `A`);
      validateOfType<MemberAccessExpression>(asMemberAccessExpression, assignmentExpression.assignment, memberAccess =>
        expect(memberAccess.variable.toString()).toBe(`B.C`));
    });
  });
});
