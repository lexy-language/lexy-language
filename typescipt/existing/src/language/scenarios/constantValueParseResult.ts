

namespace Lexy.Compiler.Language.Scenarios;

public sealed class ConstantValueParseResult : ParseResult<ConstantValue>
{
   private ConstantValueParseResult(ConstantValue result) : base(result)
   {
   }

   private ConstantValueParseResult(bool success, string errorMessage) : base(success, errorMessage)
   {
   }

   public static ConstantValueParseResult Success(ConstantValue result)
   {
     return new ConstantValueParseResult(result);
   }

   public static ConstantValueParseResult Failed(string errorMessage)
   {
     return new ConstantValueParseResult(false, errorMessage);
   }
}
