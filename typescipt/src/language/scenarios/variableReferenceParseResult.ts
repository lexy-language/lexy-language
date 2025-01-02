

public sealed class VariableReferenceParseResult : ParseResult<VariableReference> {
   private VariableReferenceParseResult(VariableReference result) super(result) {
   }

   private VariableReferenceParseResult(boolean success, string errorMessage) super(success, errorMessage) {
   }

   public static success(result: VariableReference): VariableReferenceParseResult {
     return new VariableReferenceParseResult(result);
   }

   public static failed(errorMessage: string): VariableReferenceParseResult {
     return new VariableReferenceParseResult(false, errorMessage);
   }
}
