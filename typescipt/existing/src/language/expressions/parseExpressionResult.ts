namespace Lexy.Compiler.Language.Expressions;

public sealed class ParseExpressionResult : ParseResult<Expression>
{
   private ParseExpressionResult(Expression result) : base(result)
   {
   }

   private ParseExpressionResult(bool success, string errorMessage) : base(success, errorMessage)
   {
   }

   public static ParseExpressionResult Invalid<T>(string error)
   {
     return new ParseExpressionResult(false, $"({typeof(T).Name}) {error}");
   }

   public static ParseExpressionResult Success(Expression expression)
   {
     return new ParseExpressionResult(expression);
   }
}
