import {Expression} from "./Expression";
import {OperatorToken} from "../../parser/tokens/operatorToken";
import {OperatorType} from "../../parser/tokens/operatorType";
import {SourceReference} from "../../parser/sourceReference";
import {ExpressionSource} from "./expressionSource";
import {newParseExpressionFailed, newParseExpressionSuccess, ParseExpressionResult} from "./parseExpressionResult";
import {ExpressionFactory} from "./expressionFactory";
import {TokenList} from "../../parser/tokens/tokenList";
import {INode} from "../node";
import {IValidationContext} from "../../parser/validationContext";
import {VariableType} from "../types/variableType";

export class ParenthesizedExpression extends Expression {

  public nodeType: "ParenthesizedExpression"

  public expression: Expression

  constructor(expression: Expression, source: ExpressionSource, reference: SourceReference)  {
    super(source, reference);
     this.expression = expression;
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.tokens;
     if (!this.isValid(tokens)) return newParseExpressionFailed(ParenthesizedExpression, `Not valid.`);

     let matchingClosingParenthesis = this.findMatchingClosingParenthesis(tokens);
     if (matchingClosingParenthesis == -1)
       return newParseExpressionFailed(ParenthesizedExpression, `No closing parentheses found.`);

     let innerExpressionTokens = tokens.tokensRange(1, matchingClosingParenthesis - 1);
     let innerExpression = ExpressionFactory.parse(innerExpressionTokens, source.line);
     if (innerExpression.state != 'success') return innerExpression;

     let reference = source.createReference();

     let expression = new ParenthesizedExpression(innerExpression.result, source, reference);
     return newParseExpressionSuccess(expression);
   }

   public static findMatchingClosingParenthesis(tokens: TokenList): number {
     let count = 0;
     for (let index = 0; index < tokens.length; index++) {
       let token = tokens[index];
       if (token.tokenType != "OperatorToken") continue;

       const operatorToken = token as OperatorToken;
       if (operatorToken.type == OperatorType.OpenParentheses) {
         count++;
       }
       else if (operatorToken.type == OperatorType.CloseParentheses) {
         count--;
         if (count == 0) return index;
       }
     }

     return -1;
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.isOperatorToken(0, OperatorType.OpenParentheses);
   }

   public override getChildren(): Array<INode> {
    return [ this.expression ];
   }

   protected override validate(context: IValidationContext): void {
   }

   public override deriveType(context: IValidationContext): VariableType | null {
     return this.expression.deriveType(context);
   }
}
