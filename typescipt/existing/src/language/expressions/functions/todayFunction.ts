


namespace Lexy.Compiler.Language.Expressions.Functions;

public class TodayFunction : NoArgumentFunction
{
   public const string Name = "TODAY";

   protected override VariableType ResultType => PrimitiveType.Date;

   private TodayFunction(SourceReference reference)
     : base(reference)
   {
   }

   public static ExpressionFunction Create(SourceReference reference)
   {
     return new TodayFunction(reference);
   }
}
