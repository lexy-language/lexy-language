import type {INode} from "../node";
import type {IValidationContext} from "../../parser/validationContext";
import type {IExpressionFactory} from "./expressionFactory";

import {Expression} from "./Expression";
import {ExpressionFunction} from "./functions/expressionFunction";
import {SourceReference} from "../../parser/sourceReference";
import {ExpressionSource} from "./expressionSource";
import {newParseExpressionFailed, newParseExpressionSuccess, ParseExpressionResult} from "./parseExpressionResult";
import {ParenthesizedExpression} from "./parenthesizedExpression";
import {ArgumentList} from "./argumentList";
import {BuiltInExpressionFunctions} from "./functions/builtInExpressionFunctions";
import {TokenList} from "../../parser/tokens/tokenList";
import {StringLiteralToken} from "../../parser/tokens/stringLiteralToken";
import {OperatorType} from "../../parser/tokens/operatorType";
import {VariableType} from "../variableTypes/variableType";
import {LexyFunction} from "./functions/lexyFunction";
import {BinaryExpression} from "./binaryExpression";

export function instanceOfFunctionCallExpression(object: any): object is FunctionCallExpression {
  return object?.nodeType == 'FunctionCallExpression';
}

export function asFunctionCallExpression(object: any): FunctionCallExpression | null {
  return instanceOfFunctionCallExpression(object) ? object as FunctionCallExpression : null;
}

export class FunctionCallExpression extends Expression {

  public readonly nodeType = "FunctionCallExpression"

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

  public static parse(source: ExpressionSource, factory: IExpressionFactory): ParseExpressionResult {
    let tokens = source.tokens;
    if (!FunctionCallExpression.isValid(tokens)) return newParseExpressionFailed("FunctionCallExpression", `Not valid.`);

    let matchingClosingParenthesis = ParenthesizedExpression.findMatchingClosingParenthesis(tokens);
    if (matchingClosingParenthesis == -1)
      return newParseExpressionFailed("FunctionCallExpression", `No closing parentheses found.`);

    let functionName = tokens.tokenValue(0);
    if (!functionName) return newParseExpressionFailed("FunctionCallExpression", "Invalid token.");

    let innerExpressionTokens = tokens.tokensRange(2, matchingClosingParenthesis - 1);
    let argumentsTokenList = ArgumentList.parse(innerExpressionTokens);
    if (argumentsTokenList.state != 'success')
      return newParseExpressionFailed("FunctionCallExpression", argumentsTokenList.errorMessage);

    let argumentValues = new Array<Expression>();
    argumentsTokenList.result.forEach(argumentTokens => {
      let argumentExpression = factory.parse(argumentTokens, source.line);
      if (argumentExpression.state != 'success') return argumentExpression;

      argumentValues.push(argumentExpression.result);
    });

    let reference = source.createReference();

    let builtInFunctionResult = BuiltInExpressionFunctions.parse(functionName, source.createReference(), argumentValues);
    if (builtInFunctionResult != null && builtInFunctionResult.state != "success")
      return newParseExpressionFailed("FunctionCallExpression", builtInFunctionResult.errorMessage);

    let expressionFunction = builtInFunctionResult?.result
                          ?? new LexyFunction(functionName, argumentValues, source.createReference());

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
    return this.expressionFunction != null ? this.expressionFunction.deriveReturnType(context) : null;
  }
}
