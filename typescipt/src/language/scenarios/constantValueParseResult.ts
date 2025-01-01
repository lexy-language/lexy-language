

public sealed class ConstantValueParseResult : ParseResult<ConstantValue> {
   private ConstantValueParseResult(ConstantValue result) : base(result) {
   }

   private ConstantValueParseResult(boolean success, string errorMessage) : base(success, errorMessage) {
   }

   public static success(result: ConstantValue): ConstantValueParseResult {
     return new ConstantValueParseResult(result);
   }

   public static failed(errorMessage: string): ConstantValueParseResult {
     return new ConstantValueParseResult(false, errorMessage);
   }
}
