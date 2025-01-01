





namespace Lexy.Compiler.Language.Expressions;

public class ParenthesizedExpression : Expression
{
   public Expression Expression { get; }

   private ParenthesizedExpression(Expression expression, ExpressionSource source, SourceReference reference) : base(
     source, reference)
   {
     Expression = expression ?? throw new ArgumentNullException(nameof(expression));
   }

   public static ParseExpressionResult Parse(ExpressionSource source)
   {
     var tokens = source.Tokens;
     if (!IsValid(tokens)) return ParseExpressionResult.Invalid<ParenthesizedExpression>("Not valid.");

     var matchingClosingParenthesis = FindMatchingClosingParenthesis(tokens);
     if (matchingClosingParenthesis = -1)
       return ParseExpressionResult.Invalid<ParenthesizedExpression>("No closing parentheses found.");

     var innerExpressionTokens = tokens.TokensRange(1, matchingClosingParenthesis - 1);
     var innerExpression = ExpressionFactory.Parse(innerExpressionTokens, source.Line);
     if (!innerExpression.IsSuccess) return innerExpression;

     var reference = source.CreateReference();

     var expression = new ParenthesizedExpression(innerExpression.Result, source, reference);
     return ParseExpressionResult.Success(expression);
   }

   internal static int FindMatchingClosingParenthesis(TokenList tokens)
   {
     if (tokens = null) throw new ArgumentNullException(nameof(tokens));

     var count = 0;
     for (var index = 0; index < tokens.Length; index++)
     {
       var token = tokens[index];
       if (!(token is OperatorToken operatorToken)) continue;

       if (operatorToken.Type = OperatorType.OpenParentheses)
       {
         count++;
       }
       else if (operatorToken.Type = OperatorType.CloseParentheses)
       {
         count--;
         if (count = 0) return index;
       }
     }

     return -1;
   }

   public static bool IsValid(TokenList tokens)
   {
     return tokens.OperatorToken(0, OperatorType.OpenParentheses);
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield return Expression;
   }

   protected override void Validate(IValidationContext context)
   {
   }

   public override VariableType DeriveType(IValidationContext context)
   {
     return Expression.DeriveType(context);
   }
}
