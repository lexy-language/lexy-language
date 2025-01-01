


namespace Lexy.Compiler.Language.Scenarios;

public sealed class VariableReferenceParseResult : ParseResult<VariableReference>
{
   private VariableReferenceParseResult(VariableReference result) : base(result)
   {
   }

   private VariableReferenceParseResult(bool success, string errorMessage) : base(success, errorMessage)
   {
   }

   public static VariableReferenceParseResult Success(VariableReference result)
   {
     return new VariableReferenceParseResult(result);
   }

   public static VariableReferenceParseResult Failed(string errorMessage)
   {
     return new VariableReferenceParseResult(false, errorMessage);
   }
}
