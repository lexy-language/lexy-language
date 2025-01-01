






namespace Lexy.Compiler.Language.Expressions;

public class FunctionCallExpression : Expression
{
   public string FunctionName { get; }

   public List<Expression> Arguments { get; }
   public ExpressionFunction ExpressionFunction { get; }

   private FunctionCallExpression(string functionName, List<Expression> arguments,
     ExpressionFunction expressionFunction,
     ExpressionSource source, SourceReference reference) : base(source, reference)
   {
     FunctionName = functionName ?? throw new ArgumentNullException(nameof(functionName));
     Arguments = arguments;
     ExpressionFunction = expressionFunction;
   }

   public static ParseExpressionResult Parse(ExpressionSource source)
   {
     var tokens = source.Tokens;
     if (!IsValid(tokens)) return ParseExpressionResult.Invalid<FunctionCallExpression>("Not valid.");

     var matchingClosingParenthesis = ParenthesizedExpression.FindMatchingClosingParenthesis(tokens);
     if (matchingClosingParenthesis = -1)
       return ParseExpressionResult.Invalid<FunctionCallExpression>("No closing parentheses found.");

     var functionName = tokens.TokenValue(0);
     var innerExpressionTokens = tokens.TokensRange(2, matchingClosingParenthesis - 1);
     var argumentsTokenList = ArgumentList.Parse(innerExpressionTokens);
     if (!argumentsTokenList.IsSuccess)
       return ParseExpressionResult.Invalid<FunctionCallExpression>(argumentsTokenList.ErrorMessage);

     var arguments = new List<Expression>();
     foreach (var argumentTokens in argumentsTokenList.Result)
     {
       var argumentExpression = ExpressionFactory.Parse(argumentTokens, source.Line);
       if (!argumentExpression.IsSuccess) return argumentExpression;

       arguments.Add(argumentExpression.Result);
     }

     var reference = source.CreateReference();

     var builtInFunctionResult = BuiltInExpressionFunctions.Parse(functionName, source.CreateReference(), arguments);
     if (builtInFunctionResult is { IsSuccess: false })
       return ParseExpressionResult.Invalid<FunctionCallExpression>(builtInFunctionResult.ErrorMessage);

     var expressionFunction = builtInFunctionResult?.Result
                 ?? new LexyFunction(functionName, arguments, source.CreateReference());

     var expression = new FunctionCallExpression(functionName, arguments, expressionFunction, source, reference);

     return ParseExpressionResult.Success(expression);
   }

   public static bool IsValid(TokenList tokens)
   {
     return tokens.IsTokenType<StringLiteralToken>(0)
        & tokens.OperatorToken(1, OperatorType.OpenParentheses);
   }

   public override IEnumerable<INode> GetChildren()
   {
     if (ExpressionFunction ! null) yield return ExpressionFunction;
   }

   protected override void Validate(IValidationContext context)
   {
     if (ExpressionFunction = null)
     {
       context.Logger.Fail(Reference, $"Invalid function name: '{FunctionName}'");
     }
   }

   public override VariableType DeriveType(IValidationContext context)
   {
     return ExpressionFunction?.DeriveReturnType(context);
   }
}
