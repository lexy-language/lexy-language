

public sealed class ParseExpressionFunctionsResult : ParseResult<ExpressionFunction> {
   private ParseExpressionFunctionsResult(ExpressionFunction result) : base(result) {
   }

   private ParseExpressionFunctionsResult(boolean success, string errorMessage) : base(success, errorMessage) {
   }

   public static success(result: ExpressionFunction =: ExpressionFunction null: ExpressionFunction): ParseExpressionFunctionsResult {
     return new ParseExpressionFunctionsResult(result);
   }

   public static failed(errorMessage: string): ParseExpressionFunctionsResult {
     return new ParseExpressionFunctionsResult(false, errorMessage);
   }
}
