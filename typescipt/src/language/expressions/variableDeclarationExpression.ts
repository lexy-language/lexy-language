import {Expression} from "./Expression";
import {SourceReference} from "../../parser/sourceReference";
import {ExpressionSource} from "./expressionSource";
import {VariableDeclarationType} from "../types/variableDeclarationType";
import {newParseExpressionFailed, newParseExpressionSuccess, ParseExpressionResult} from "./parseExpressionResult";
import {ExpressionFactory} from "./expressionFactory";
import {TokenList} from "../../parser/tokens/tokenList";
import {Keywords} from "../../parser/Keywords";
import {StringLiteralToken} from "../../parser/tokens/stringLiteralToken";
import {OperatorType} from "../../parser/tokens/operatorType";
import {INode} from "../node";
import {IValidationContext} from "../../parser/validationContext";
import {VariableType} from "../types/variableType";
import {ImplicitVariableDeclaration} from "../types/implicitVariableDeclaration";
import {VariableSource} from "../../parser/variableSource";

export class VariableDeclarationExpression extends Expression {

  public nodeType: "VariableDeclarationExpression"

  public type: VariableDeclarationType
  public name: string
  public assignment: Expression | null

  constructor(variableType: VariableDeclarationType, variableName: string, assignment: Expression | null, source: ExpressionSource, reference: SourceReference) {
    super(source, reference)
    this.type = VariableDeclarationType;
    this.name = variableName;
    this.assignment = assignment;
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.tokens;
     if (!VariableDeclarationExpression.isValid(tokens)) {
       return newParseExpressionFailed(VariableDeclarationExpression, `Invalid expression.`);
     }

     const typeName = tokens.tokenValue(0)
     if (typeName == null) {
       return newParseExpressionFailed(VariableDeclarationExpression, `Invalid type name.`);
     }

     let type = VariableDeclarationType.parse(typeName, source.createReference());
     let name = tokens.tokenValue(1);
     if (name == null) {
       return newParseExpressionFailed(VariableDeclarationExpression, `Invalid name.`);
     }

     let assignment = tokens.length > 3
       ? ExpressionFactory.parse(tokens.tokensFrom(3), source.line)
       : null;

     if (assignment?.state == "failed") return assignment;

     let reference = source.createReference();

     let expression = new VariableDeclarationExpression(type, name, assignment?.result ?? null, source, reference);

     return newParseExpressionSuccess(expression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.length == 2
          && tokens.isKeyword(0, Keywords.ImplicitVariableDeclaration)
          && tokens.isTokenType<StringLiteralToken>(1, StringLiteralToken)
        || tokens.length == 2
          && tokens.isTokenType<StringLiteralToken>(0, StringLiteralToken)
          && tokens.isTokenType<StringLiteralToken>(1, StringLiteralToken)
        || tokens.length >= 4
          && tokens.isKeyword(0, Keywords.ImplicitVariableDeclaration)
          && tokens.isTokenType<StringLiteralToken>(1, StringLiteralToken)
          && tokens.isOperatorToken(2, OperatorType.Assignment)
        || tokens.length >= 4
          && tokens.isTokenType<StringLiteralToken>(0, StringLiteralToken)
          && tokens.isTokenType<StringLiteralToken>(1, StringLiteralToken)
          && tokens.isOperatorToken(2, OperatorType.Assignment);
   }

   public override getChildren(): Array<INode> {
    const result = [];
    if (this.assignment != null) result.push(this.assignment);
    result.push(this.type);
    return result;
   }

   protected override validate(context: IValidationContext): void {
     let assignmentType = this.assignment?.deriveType(context);
     if (this.assignment != null && assignmentType == null) {
       context.logger.fail(this.reference, `Invalid expression. Could not derive type.`);
     }

     let variableType = !!assignmentType ? this.getVariableType(context, assignmentType): null;
     if (variableType == null) {
       context.logger.fail(this.reference, `Invalid variable type '${this.type}'`);
     }

     context.variableContext?.registerVariableAndVerifyUnique(this.reference, this.name, variableType, VariableSource.Code);
   }

   private getVariableType(context: IValidationContext, assignmentType: VariableType): VariableType {
     if (this.type.nodeType == "ImplicitVariableDeclaration") {
       const implicitVariableType = this.type as ImplicitVariableDeclaration;
       implicitVariableType.define(assignmentType);
       return assignmentType;
     }

     let variableType = this.type.createVariableType(context);
     if (this.assignment != null && !assignmentType.equals(variableType)) {
       context.logger.fail(this.reference, `Invalid expression. Literal or enum value expression expected.`);
     }

     return variableType;
   }

   public override deriveType(context: IValidationContext): VariableType | null {
     return null;
   }
}
