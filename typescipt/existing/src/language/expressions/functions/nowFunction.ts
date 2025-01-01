


namespace Lexy.Compiler.Language.Expressions.Functions;

public class NowFunction : NoArgumentFunction
{
   public const string Name = "NOW";

   protected override VariableType ResultType => PrimitiveType.Date;

   private NowFunction(SourceReference reference)
     : base(reference)
   {
   }

   public static ExpressionFunction Create(SourceReference reference)
   {
     return new NowFunction(reference);
   }
}
