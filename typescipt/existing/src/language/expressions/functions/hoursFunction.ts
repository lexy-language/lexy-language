

namespace Lexy.Compiler.Language.Expressions.Functions;

public class HoursFunction : EndStartDateFunction
{
   public const string Name = "HOURS";

   protected override string FunctionName => Name;

   private HoursFunction(Expression endDateExpression, Expression startDateExpression, SourceReference reference)
     : base(endDateExpression, startDateExpression, reference)
   {
   }

   public static ExpressionFunction Create(SourceReference reference, Expression endDateExpression,
     Expression startDateExpression)
   {
     return new HoursFunction(endDateExpression, startDateExpression, reference);
   }
}
