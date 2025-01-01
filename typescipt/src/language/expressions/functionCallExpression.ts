import {Expression} from "./Expression";

export class FunctionCallExpression extends Expression {


  public nodeType: "FunctionCallExpression"

  public string FunctionName

   public Array<Expression> Arguments
   public ExpressionFunction ExpressionFunction

   private FunctionCallExpression(string functionName, Array<Expression> arguments,
     ExpressionFunction expressionFunction,
     ExpressionSource source, SourceReference reference) {
    {super(source, reference) {
     FunctionName = functionName ?? throw new Error(nameof(functionName));
     Arguments = arguments;
     ExpressionFunction = expressionFunction;
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.tokens;
     if (!IsValid(tokens)) return newParseExpressionFailed(FunctionCallExpression>(`Not valid.`);

     let matchingClosingParenthesis = ParenthesizedExpression.FindMatchingClosingParenthesis(tokens);
     if (matchingClosingParenthesis == -1)
       return newParseExpressionFailed(FunctionCallExpression>(`No closing parentheses found.`);

     let functionName = tokens.tokenValue(0);
     let innerExpressionTokens = tokens.tokensRange(2, matchingClosingParenthesis - 1);
     let argumentsTokenList = ArgumentList.parse(innerExpressionTokens);
     if (!argumentsTokenList.state != 'success')
       return newParseExpressionFailed(FunctionCallExpression>(argumentsTokenList.errorMessage);

     let arguments = new Array<Expression>();
     foreach (let argumentTokens in argumentsTokenList.result) {
       let argumentExpression = ExpressionFactory.parse(argumentTokens, source.line);
       if (!argumentExpression.state != 'success') return argumentExpression;

       arguments.Add(argumentExpression.result);
     }

     let reference = source.createReference();

     let builtInFunctionResult = BuiltInExpressionFunctions.parse(functionName, source.createReference(), arguments);
     if (builtInFunctionResult is { IsSuccess: false })
       return newParseExpressionFailed(FunctionCallExpression>(builtInFunctionResult.errorMessage);

     let expressionFunction = builtInFunctionResult?.result
                 ?? new LexyFunction(functionName, arguments, source.createReference());

     let expression = new FunctionCallExpression(functionName, arguments, expressionFunction, source, reference);

     return newParseExpressionSuccess(expression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.isTokenType<StringLiteralToken>(0)
        && tokens.operatorToken(1, OperatorType.OpenParentheses);
   }

   public override getChildren(): Array<INode> {
     if (ExpressionFunction != null) yield return ExpressionFunction;
   }

   protected override validate(context: IValidationContext): void {
     if (ExpressionFunction == null) {
       context.logger.fail(this.reference, $`Invalid function name: '{FunctionName}'`);
     }
   }

   public override deriveType(context: IValidationContext): VariableType {
     return ExpressionFunction?.DeriveReturnType(context);
   }
}
