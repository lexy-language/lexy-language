

namespace Lexy.Compiler.Language.Expressions.Functions;

public class YearsFunction : EndStartDateFunction
{
   public const string Name = "YEARS";

   protected override string FunctionName => Name;

   private YearsFunction(Expression endDateExpression, Expression startDateExpression, SourceReference reference)
     : base(endDateExpression, startDateExpression, reference)
   {
   }

   public static ExpressionFunction Create(SourceReference reference, Expression endDateExpression,
     Expression startDateExpression)
   {
     return new YearsFunction(endDateExpression, startDateExpression, reference);
   }
}
