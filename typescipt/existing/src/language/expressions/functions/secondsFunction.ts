

namespace Lexy.Compiler.Language.Expressions.Functions;

public class SecondsFunction : EndStartDateFunction
{
   public const string Name = "SECONDS";

   protected override string FunctionName => Name;

   private SecondsFunction(Expression endDateExpression, Expression startDateExpression, SourceReference reference)
     : base(endDateExpression, startDateExpression, reference)
   {
   }

   public static ExpressionFunction Create(SourceReference reference, Expression endDateExpression,
     Expression startDateExpression)
   {
     return new SecondsFunction(endDateExpression, startDateExpression, reference);
   }
}
