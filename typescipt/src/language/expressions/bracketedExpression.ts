import type {INode} from "../node";
import type {IValidationContext} from "../../parser/validationContext";
import type {IExpressionFactory} from "./expressionFactory";

import {Expression} from "./expression";
import {ExpressionSource} from "./expressionSource";
import {SourceReference} from "../../parser/sourceReference";
import {newParseExpressionFailed, newParseExpressionSuccess, ParseExpressionResult} from "./parseExpressionResult";
import {TokenList} from "../../parser/tokens/tokenList";
import {StringLiteralToken} from "../../parser/tokens/stringLiteralToken";
import {OperatorType} from "../../parser/tokens/operatorType";
import {OperatorToken} from "../../parser/tokens/operatorToken";
import {VariableType} from "../variableTypes/variableType";
import {IntFunction} from "./functions/intFunction";
import {NodeType} from "../nodeType";

export function instanceOfBracketedExpression(object: any): object is BracketedExpression {
  return object?.nodeType == NodeType.BracketedExpression;
}

export function asBracketedExpression(object: any): BracketedExpression | null {
  return instanceOfBracketedExpression(object) ? object as BracketedExpression : null;
}

export class BracketedExpression extends Expression {

  public nodeType = NodeType.BracketedExpression;
  public functionName: string
  public expression: Expression

  constructor(functionName: string, expression: Expression,
              source: ExpressionSource, reference: SourceReference) {
    super(source, reference)
    this.functionName = functionName;
    this.expression = expression;
  }

  public static parse(source: ExpressionSource, factory: IExpressionFactory): ParseExpressionResult {
    let tokens = source.tokens;
    if (!BracketedExpression.isValid(tokens)) return newParseExpressionFailed("BracketedExpression", `Not valid.`);

    let matchingClosingParenthesis = BracketedExpression.findMatchingClosingBracket(tokens);
    if (matchingClosingParenthesis == -1)
      return newParseExpressionFailed("BracketedExpression", `No closing bracket found.`);

    let functionName = tokens.tokenValue(0);
    if (functionName == null) return newParseExpressionFailed("BracketedExpression", `Invalid function name.`);

    let innerExpressionTokens = tokens.tokensRange(2, matchingClosingParenthesis - 1);
    let innerExpression = factory.parse(innerExpressionTokens, source.line);
    if (innerExpression.state != 'success') return innerExpression;

    let reference = source.createReference();

    let expression = new BracketedExpression(functionName, innerExpression.result, source, reference);
    return newParseExpressionSuccess(expression);
  }

  public static isValid(tokens: TokenList): boolean {
    return tokens.length > 1
      && tokens.isTokenType<StringLiteralToken>(0, StringLiteralToken)
      && tokens.isOperatorToken(1, OperatorType.OpenBrackets);
  }

  private static findMatchingClosingBracket(tokens: TokenList): number {
    let count = 0;
    for (let index = 0; index < tokens.length; index++) {
      let token = tokens.get(index);
      if (token.tokenType != "OperatorToken") continue;

      const operatorToken = token as OperatorToken;
      if (operatorToken.type == OperatorType.OpenBrackets) {
        count++;
      } else if (operatorToken.type == OperatorType.CloseBrackets) {
        count--;
        if (count == 0) return index;
      }
    }

    return -1;
  }

  public override getChildren(): Array<INode> {
    return [Expression];
  }

  protected override validate(context: IValidationContext): void {
  }

  public override deriveType(context: IValidationContext): VariableType | null {
    return this.expression.deriveType(context);
  }
}
