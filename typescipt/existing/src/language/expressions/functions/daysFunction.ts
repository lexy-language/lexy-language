

namespace Lexy.Compiler.Language.Expressions.Functions;

public class DaysFunction : EndStartDateFunction
{
   public const string Name = "DAYS";

   protected override string FunctionName => Name;

   private DaysFunction(Expression endDateExpression, Expression startDateExpression, SourceReference reference)
     : base(endDateExpression, startDateExpression, reference)
   {
   }

   public static ExpressionFunction Create(SourceReference reference, Expression endDateExpression,
     Expression startDateExpression)
   {
     return new DaysFunction(endDateExpression, startDateExpression, reference);
   }
}
