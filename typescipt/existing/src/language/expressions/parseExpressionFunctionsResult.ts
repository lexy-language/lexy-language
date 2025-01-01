

namespace Lexy.Compiler.Language.Expressions;

public sealed class ParseExpressionFunctionsResult : ParseResult<ExpressionFunction>
{
   private ParseExpressionFunctionsResult(ExpressionFunction result) : base(result)
   {
   }

   private ParseExpressionFunctionsResult(bool success, string errorMessage) : base(success, errorMessage)
   {
   }

   public static ParseExpressionFunctionsResult Success(ExpressionFunction result = null)
   {
     return new ParseExpressionFunctionsResult(result);
   }

   public static ParseExpressionFunctionsResult Failed(string errorMessage)
   {
     return new ParseExpressionFunctionsResult(false, errorMessage);
   }
}
