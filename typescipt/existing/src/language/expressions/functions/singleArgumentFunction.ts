




namespace Lexy.Compiler.Language.Expressions.Functions;

public abstract class SingleArgumentFunction : ExpressionFunction
{
   protected abstract string FunctionHelp { get; }

   protected abstract VariableType ArgumentType { get; }
   protected abstract VariableType ResultType { get; }

   public Expression ValueExpression { get; }

   protected SingleArgumentFunction(Expression valueExpression, SourceReference reference)
     : base(reference)
   {
     ValueExpression = valueExpression ?? throw new ArgumentNullException(nameof(valueExpression));
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield return ValueExpression;
   }

   protected override void Validate(IValidationContext context)
   {
     context.ValidateType(ValueExpression, 1, "Value", ArgumentType, Reference, FunctionHelp);
   }

   public override VariableType DeriveReturnType(IValidationContext context)
   {
     return ResultType;
   }
}
