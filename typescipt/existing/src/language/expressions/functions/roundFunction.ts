



namespace Lexy.Compiler.Language.Expressions.Functions;

public class RoundFunction : ExpressionFunction
{
   public const string Name = "ROUND";

   private string FunctionHelp => $"'{Name}' expects 2 arguments (Number, Digits).";

   public Expression NumberExpression { get; }
   public Expression DigitsExpression { get; }

   protected RoundFunction(Expression numberExpression, Expression digitsExpression, SourceReference reference)
     : base(reference)
   {
     NumberExpression = numberExpression;
     DigitsExpression = digitsExpression;
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield return NumberExpression;
     yield return DigitsExpression;
   }

   protected override void Validate(IValidationContext context)
   {
     context
       .ValidateType(NumberExpression, 1, "Number", PrimitiveType.Number, Reference, FunctionHelp)
       .ValidateType(DigitsExpression, 2, "Digits", PrimitiveType.Number, Reference, FunctionHelp);
   }

   public override VariableType DeriveReturnType(IValidationContext context)
   {
     return PrimitiveType.Number;
   }

   public static ExpressionFunction Create(SourceReference reference, Expression numberExpression,
     Expression powerExpression)
   {
     return new RoundFunction(numberExpression, powerExpression, reference);
   }
}
