



namespace Lexy.Compiler.Language.Expressions.Functions;

public class PowerFunction : ExpressionFunction
{
   public const string Name = "POWER";

   private string FunctionHelp => $"'{Name} expects 2 arguments (Number, Power).";

   public Expression NumberExpression { get; }
   public Expression PowerExpression { get; }

   protected PowerFunction(Expression numberExpression, Expression powerExpression, SourceReference reference)
     : base(reference)
   {
     NumberExpression = numberExpression;
     PowerExpression = powerExpression;
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield return NumberExpression;
     yield return PowerExpression;
   }

   protected override void Validate(IValidationContext context)
   {
     context
       .ValidateType(NumberExpression, 1, "Number", PrimitiveType.Number, Reference, FunctionHelp)
       .ValidateType(PowerExpression, 2, "Power", PrimitiveType.Number, Reference, FunctionHelp);
   }

   public override VariableType DeriveReturnType(IValidationContext context)
   {
     return PrimitiveType.Number;
   }

   public static ExpressionFunction Create(SourceReference reference, Expression numberExpression,
     Expression powerExpression)
   {
     return new PowerFunction(numberExpression, powerExpression, reference);
   }
}
