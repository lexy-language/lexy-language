import {Expression} from "./expression";
import {ExpressionSource} from "./expressionSource";
import {SourceReference} from "../../parser/sourceReference";
import {newParseExpressionFailed, newParseExpressionSuccess, ParseExpressionResult} from "./parseExpressionResult";
import {ExpressionFactory} from "./expressionFactory";
import {TokenList} from "../../parser/tokens/tokenList";
import {StringLiteralToken} from "../../parser/tokens/stringLiteralToken";
import {OperatorType} from "../../parser/tokens/operatorType";
import {OperatorToken} from "../../parser/tokens/operatorToken";
import {INode} from "../node";
import {IValidationContext} from "../../parser/validationContext";
import {VariableType} from "../types/variableType";

export class BracketedExpression extends Expression {

  public nodeType: "BracketedExpression"
  public functionName: string
  public expression: Expression

  constructor(functionName: string, expression: Expression,
              source: ExpressionSource, reference: SourceReference) {
    super(source, reference)
    this.functionName = functionName;
    this.expression = expression;
  }

  public static parse(source: ExpressionSource): ParseExpressionResult {
    let tokens = source.tokens;
    if (!BracketedExpression.isValid(tokens)) return newParseExpressionFailed(BracketedExpression, `Not valid.`);

    let matchingClosingParenthesis = this.findMatchingClosingBracket(tokens);
    if (matchingClosingParenthesis == -1)
      return newParseExpressionFailed(BracketedExpression, `No closing bracket found.`);

    let functionName = tokens.tokenValue(0);
    if (functionName == null) return newParseExpressionFailed(BracketedExpression, `Invalid function name.`);

    let innerExpressionTokens = tokens.tokensRange(2, matchingClosingParenthesis - 1);
    let innerExpression = ExpressionFactory.parse(innerExpressionTokens, source.line);
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
      let token = tokens[index];
      if (token.nodeType != "OperatorToken") continue;

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
