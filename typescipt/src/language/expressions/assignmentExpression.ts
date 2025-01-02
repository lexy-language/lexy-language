import {Expression} from "./Expression";
import {SourceReference} from "../../parser/sourceReference";
import {ExpressionSource} from "./expressionSource";
import {newParseExpressionFailed, newParseExpressionSuccess, ParseExpressionResult} from "./parseExpressionResult";
import {ExpressionFactory} from "./expressionFactory";
import {TokenList} from "../../parser/tokens/tokenList";
import {OperatorType} from "../../parser/tokens/operatorType";
import {StringLiteralToken} from "../../parser/tokens/stringLiteralToken";
import {MemberAccessLiteral} from "../../parser/tokens/memberAccessLiteral";
import {INode} from "../node";
import {IValidationContext} from "../../parser/validationContext";
import {IdentifierExpression} from "./identifierExpression";
import {MemberAccessExpression} from "./memberAccessExpression";
import {asTypeWithMembers} from "../types/iTypeWithMembers";
import {VariableType} from "../types/variableType";

export class AssignmentExpression extends Expression {
  public nodeType: "AssignmentExpression"
  public variable: Expression
  public assignment: Expression

  private constructor(variable: Expression, assignment: Expression, source: ExpressionSource,
   reference: SourceReference) {
   super(source, reference);
   this.variable = variable;
   this.assignment = assignment;
  }

  public static parse(source: ExpressionSource): ParseExpressionResult {
   let tokens = source.tokens;
   if (!this.isValid(tokens)) return newParseExpressionFailed(AssignmentExpression,`Invalid expression.`);

   let variableExpression = ExpressionFactory.parse(tokens.tokensFromStart(1), source.line);
   if (variableExpression.state != 'success') return variableExpression;

   let assignment = ExpressionFactory.parse(tokens.tokensFrom(2), source.line);
   if (assignment.state != 'success') return assignment;

   let reference = source.createReference();

   let expression = new AssignmentExpression(variableExpression.result, assignment.result, source, reference);

   return newParseExpressionSuccess(expression);
  }

  public static isValid(tokens: TokenList): boolean {
   return tokens.length >= 3
      && (tokens.isTokenType<StringLiteralToken>(0, StringLiteralToken)
       || tokens.isTokenType<MemberAccessLiteral>(0, MemberAccessLiteral))
      && tokens.isOperatorToken(1, OperatorType.Assignment);
  }

  public override getChildren(): Array<INode> {
   return [
     this.assignment,
     this.variable
   ]
  }

  protected override validate(context: IValidationContext): void {
   if (this.variable.nodeType != "IdentifierExpression") {
     this.validateMemberAccess(context);
     return;
   }

   const identifierExpression = this.variable as IdentifierExpression;

   let variableName = identifierExpression.identifier;

   let variableType = context.variableContext?.getVariableTypeByName(variableName);
   if (variableType == null) {
     context.logger.fail(this.reference, `Unknown variable name: '${variableName}'.`);
     return;
   }

   let expressionType = this.assignment.deriveType(context);
   if (!variableType?.equals(expressionType))
     context.logger.fail(this.reference,
       `Variable '${variableName}' of type '${variableType}' is not assignable from expression of type '{expressionType}'.`);
  }

  private validateMemberAccess(context: IValidationContext): void {
   if (this.variable.nodeType != "MemberAccessExpression") {
     return;
   }

   const memberAccessExpression = this.variable as MemberAccessExpression;

   let assignmentType = this.assignment.deriveType(context);

   let variableType = context.variableContext?.getVariableType(memberAccessExpression.variable, context);
   if (variableType != null) {
     if (assignmentType == null || !assignmentType.equals(variableType))
       context.logger.fail(this.reference,
         `Variable '${memberAccessExpression.variable}' of type '${variableType}' is not assignable from expression of type '${assignmentType}'.`);
     return;
   }

   let literal = memberAccessExpression.memberAccessLiteral;
   let parentType = context.rootNodes.getType(literal.parent);

    const typeWithMembers = asTypeWithMembers(parentType);

    if (typeWithMembers == null) {
     context.logger.fail(this.reference, `Type '${literal.parent}' has no members.`);
     return;
   }

   let memberType = typeWithMembers.memberType(literal.member, context);
   if (assignmentType == null || !assignmentType.equals(memberType))
     context.logger.fail(this.reference,
       `Variable '${literal}' of type '${memberType}' is not assignable from expression of type '${assignmentType}'.`);
  }

  public override deriveType(context: IValidationContext): VariableType | null {
    return this.assignment.deriveType(context);
  }
}
