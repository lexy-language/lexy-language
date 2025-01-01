
public sealed class ParseExpressionResult : ParseResult<Expression> {
   private ParseExpressionResult(Expression result) : base(result) {
   }

   private ParseExpressionResult(boolean success, string errorMessage) : base(success, errorMessage) {
   }

   public static invalid<T>(error: string): ParseExpressionResult {
     return new ParseExpressionResult(false, $`({typeof(T).Name}) {error}`);
   }

   public static success(expression: Expression): ParseExpressionResult {
     return new ParseExpressionResult(expression);
   }
}
