

namespace Lexy.Compiler.Language.Expressions.Functions;

public class MonthsFunction : EndStartDateFunction
{
   public const string Name = "MONTHS";

   protected override string FunctionName => Name;

   private MonthsFunction(Expression endDateExpression, Expression startDateExpression, SourceReference reference)
     : base(endDateExpression, startDateExpression, reference)
   {
   }

   public static ExpressionFunction Create(SourceReference reference, Expression endDateExpression,
     Expression startDateExpression)
   {
     return new MonthsFunction(endDateExpression, startDateExpression, reference);
   }
}
