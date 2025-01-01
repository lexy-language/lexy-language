

public sealed class VariableReferenceParseResult : ParseResult<VariableReference> {
   private VariableReferenceParseResult(VariableReference result) : base(result) {
   }

   private VariableReferenceParseResult(boolean success, string errorMessage) : base(success, errorMessage) {
   }

   public static success(result: VariableReference): VariableReferenceParseResult {
     return new VariableReferenceParseResult(result);
   }

   public static failed(errorMessage: string): VariableReferenceParseResult {
     return new VariableReferenceParseResult(false, errorMessage);
   }
}
