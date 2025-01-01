



namespace Lexy.Compiler.Language.Expressions.Functions;

public abstract class EndStartDateFunction : ExpressionFunction
{
   private string FunctionHelp => $"'{FunctionName}' expects 2 arguments (EndDate, StartDate).";

   protected abstract string FunctionName { get; }

   public Expression EndDateExpression { get; }
   public Expression StartDateExpression { get; }

   protected EndStartDateFunction(Expression endDateExpression, Expression startDateExpression,
     SourceReference reference)
     : base(reference)
   {
     EndDateExpression = endDateExpression;
     StartDateExpression = startDateExpression;
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield return EndDateExpression;
     yield return StartDateExpression;
   }

   protected override void Validate(IValidationContext context)
   {
     context
       .ValidateType(EndDateExpression, 1, "EndDate", PrimitiveType.Date, Reference, FunctionHelp)
       .ValidateType(StartDateExpression, 2, "EndDate", PrimitiveType.Date, Reference, FunctionHelp);
   }

   public override VariableType DeriveReturnType(IValidationContext context)
   {
     return PrimitiveType.Number;
   }
}
