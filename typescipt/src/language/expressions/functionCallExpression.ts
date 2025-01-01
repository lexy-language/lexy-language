

export class FunctionCallExpression extends Expression {
   public string FunctionName

   public Array<Expression> Arguments
   public ExpressionFunction ExpressionFunction

   private FunctionCallExpression(string functionName, Array<Expression> arguments,
     ExpressionFunction expressionFunction,
     ExpressionSource source, SourceReference reference) : base(source, reference) {
     FunctionName = functionName ?? throw new Error(nameof(functionName));
     Arguments = arguments;
     ExpressionFunction = expressionFunction;
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.Tokens;
     if (!IsValid(tokens)) return ParseExpressionResult.Invalid<FunctionCallExpression>(`Not valid.`);

     let matchingClosingParenthesis = ParenthesizedExpression.FindMatchingClosingParenthesis(tokens);
     if (matchingClosingParenthesis == -1)
       return ParseExpressionResult.Invalid<FunctionCallExpression>(`No closing parentheses found.`);

     let functionName = tokens.TokenValue(0);
     let innerExpressionTokens = tokens.TokensRange(2, matchingClosingParenthesis - 1);
     let argumentsTokenList = ArgumentList.Parse(innerExpressionTokens);
     if (!argumentsTokenList.IsSuccess)
       return ParseExpressionResult.Invalid<FunctionCallExpression>(argumentsTokenList.ErrorMessage);

     let arguments = new Array<Expression>();
     foreach (let argumentTokens in argumentsTokenList.Result) {
       let argumentExpression = ExpressionFactory.Parse(argumentTokens, source.Line);
       if (!argumentExpression.IsSuccess) return argumentExpression;

       arguments.Add(argumentExpression.Result);
     }

     let reference = source.CreateReference();

     let builtInFunctionResult = BuiltInExpressionFunctions.Parse(functionName, source.CreateReference(), arguments);
     if (builtInFunctionResult is { IsSuccess: false })
       return ParseExpressionResult.Invalid<FunctionCallExpression>(builtInFunctionResult.ErrorMessage);

     let expressionFunction = builtInFunctionResult?.Result
                 ?? new LexyFunction(functionName, arguments, source.CreateReference());

     let expression = new FunctionCallExpression(functionName, arguments, expressionFunction, source, reference);

     return ParseExpressionResult.Success(expression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.IsTokenType<StringLiteralToken>(0)
        && tokens.OperatorToken(1, OperatorType.OpenParentheses);
   }

   public override getChildren(): Array<INode> {
     if (ExpressionFunction != null) yield return ExpressionFunction;
   }

   protected override validate(context: IValidationContext): void {
     if (ExpressionFunction == null) {
       context.Logger.Fail(Reference, $`Invalid function name: '{FunctionName}'`);
     }
   }

   public override deriveType(context: IValidationContext): VariableType {
     return ExpressionFunction?.DeriveReturnType(context);
   }
}
