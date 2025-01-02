import {Expression} from "./Expression";
import {ExpressionFunction} from "./functions/expressionFunction";
import {SourceReference} from "../../parser/sourceReference";
import {ExpressionSource} from "./expressionSource";
import {newParseExpressionFailed, newParseExpressionSuccess, ParseExpressionResult} from "./parseExpressionResult";
import {ParenthesizedExpression} from "./parenthesizedExpression";
import {ArgumentList} from "./argumentList";
import {ExpressionFactory} from "./expressionFactory";
import {BuiltInExpressionFunctions} from "./functions/builtInExpressionFunctions";
import {TokenList} from "../../parser/tokens/tokenList";
import {StringLiteralToken} from "../../parser/tokens/stringLiteralToken";
import {OperatorType} from "../../parser/tokens/operatorType";
import {INode} from "../node";
import {IValidationContext} from "../../parser/validationContext";
import {VariableType} from "../types/variableType";

export class FunctionCallExpression extends Expression {

  public nodeType: "FunctionCallExpression"

  public readonly functionName: string;
  public readonly arguments: Array<Expression>;
  public readonly expressionFunction: ExpressionFunction;

  constructor(functionName: string, argumentValues: Array<Expression>,
              expressionFunction: ExpressionFunction, source: ExpressionSource,
              reference: SourceReference) {
    super(source, reference);
    this.functionName = functionName;
    this.arguments = argumentValues;
    this.expressionFunction = expressionFunction;
  }

  public static parse(source: ExpressionSource): ParseExpressionResult {
    let tokens = source.tokens;
    if (!this.isValid(tokens)) return newParseExpressionFailed(FunctionCallExpression, `Not valid.`);

    let matchingClosingParenthesis = ParenthesizedExpression.findMatchingClosingParenthesis(tokens);
    if (matchingClosingParenthesis == -1)
      return newParseExpressionFailed(FunctionCallExpression, `No closing parentheses found.`);

    let functionName = tokens.tokenValue(0);
    if (!functionName) return newParseExpressionFailed(FunctionCallExpression, "Invalid token.");

    let innerExpressionTokens = tokens.tokensRange(2, matchingClosingParenthesis - 1);
    let argumentsTokenList = ArgumentList.parse(innerExpressionTokens);
    if (argumentsTokenList.state != 'success')
      return newParseExpressionFailed(FunctionCallExpression, argumentsTokenList.errorMessage);

    let argumentValues = new Array<Expression>();
    argumentsTokenList.result.forEach(argumentTokens => {
      let argumentExpression = ExpressionFactory.parse(argumentTokens, source.line);
      if (argumentExpression.state != 'success') return argumentExpression;

      argumentValues.push(argumentExpression.result);
    });

    let reference = source.createReference();

    let builtInFunctionResult = BuiltInExpressionFunctions.parse(functionName, source.createReference(), arguments);
    if (builtInFunctionResult.state != "success")
      return newParseExpressionFailed(FunctionCallExpression, builtInFunctionResult.errorMessage);

    let expressionFunction = builtInFunctionResult?.result
                          ?? new LexyFunction(functionName, arguments, source.createReference());

    let expression = new FunctionCallExpression(functionName, argumentValues, expressionFunction, source, reference);

    return newParseExpressionSuccess(expression);
  }

  public static isValid(tokens: TokenList): boolean {
    return tokens.isTokenType<StringLiteralToken>(0, StringLiteralToken)
      && tokens.isOperatorToken(1, OperatorType.OpenParentheses);
  }

  public override getChildren(): Array<INode> {
    return this.expressionFunction != null ? [this.expressionFunction] : [];
  }

  protected override validate(context: IValidationContext): void {
  }

  public override deriveType(context: IValidationContext): VariableType | null {
    return this.expressionFunction?.deriveReturnType(context);
  }
}
