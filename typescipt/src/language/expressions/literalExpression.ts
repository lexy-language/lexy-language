import type {ILiteralToken} from "../../parser/tokens/ILiteralToken";
import type {INode} from "../node";
import type {IValidationContext} from "../../parser/validationContext";
import type {IExpressionFactory} from "./expressionFactory";

import {Expression} from "./Expression";
import {ExpressionSource} from "./expressionSource";
import {SourceReference} from "../../parser/sourceReference";
import {newParseExpressionFailed, newParseExpressionSuccess, ParseExpressionResult} from "./parseExpressionResult";
import {TokenList} from "../../parser/tokens/tokenList";
import {instanceOfNumberLiteralToken, NumberLiteralToken} from "../../parser/tokens/numberLiteralToken";
import {OperatorType} from "../../parser/tokens/operatorType";
import {VariableType} from "../variableTypes/variableType";

export function instanceOfLiteralExpression(object: any): boolean {
  return object?.nodeType == "LiteralExpression";
}

export function asLiteralExpression(object: any): LiteralExpression | null {
  return instanceOfLiteralExpression(object) ? object as LiteralExpression : null;
}

export class LiteralExpression extends Expression {

  public nodeType = "LiteralExpression";

   public literal: ILiteralToken;

  constructor(literal: ILiteralToken, source: ExpressionSource, reference: SourceReference) {
    super(source, reference);
    this.literal = literal;
  }

   public static parse(source: ExpressionSource, factory: IExpressionFactory): ParseExpressionResult {
     let tokens = source.tokens;
     if (!LiteralExpression.isValid(tokens)) return newParseExpressionFailed("LiteralExpression", `Invalid expression.`);

     let reference = source.createReference();

     if (tokens.length == 2) return LiteralExpression.negativeNumeric(source, tokens, reference);

     let literalToken = tokens.literalToken(0);
     if (!literalToken) return newParseExpressionFailed("LiteralExpression", "Invalid token");

     let expression = new LiteralExpression(literalToken, source, reference);
     return newParseExpressionSuccess(expression);
   }

   private static negativeNumeric(source: ExpressionSource, tokens: TokenList, reference: SourceReference): ParseExpressionResult  {
     let operatorToken = tokens.operatorToken(0);
     if (!operatorToken) return newParseExpressionFailed("LiteralExpression", "Invalid token");
     
     let numericLiteralToken = tokens.literalToken(1) as NumberLiteralToken;
     let value = -numericLiteralToken.numberValue;

     let negatedLiteral = new NumberLiteralToken(value, operatorToken.firstCharacter);

     let negatedExpression = new LiteralExpression(negatedLiteral, source, reference);
     return newParseExpressionSuccess(negatedExpression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.length == 1
        && tokens.isLiteralToken(0)
        || tokens.length == 2
        && tokens.isOperatorToken(0, OperatorType.Subtraction)
        && tokens.isLiteralToken(1)
        && instanceOfNumberLiteralToken(tokens.literalToken(1));
   }

   public override getChildren(): Array<INode> {
     return [];
   }

   protected override validate(context: IValidationContext): void {
   }

   public override deriveType(context: IValidationContext): VariableType | null {
     return this.literal.deriveType(context);
   }
}
