

namespace Lexy.Compiler.Language.Expressions.Functions;

public class MinutesFunction : EndStartDateFunction
{
   public const string Name = "MINUTES";

   protected override string FunctionName => Name;

   private MinutesFunction(Expression endDateExpression, Expression startDateExpression, SourceReference reference)
     : base(endDateExpression, startDateExpression, reference)
   {
   }

   public static ExpressionFunction Create(SourceReference reference, Expression endDateExpression,
     Expression startDateExpression)
   {
     return new MinutesFunction(endDateExpression, startDateExpression, reference);
   }
}
