


namespace Lexy.Compiler.Language.Expressions.Functions;

public class IntFunction : SingleArgumentFunction
{
   public const string Name = "INT";

   protected override string FunctionHelp => $"{Name} expects 1 argument (Value)";

   protected override VariableType ArgumentType => PrimitiveType.Number;
   protected override VariableType ResultType => PrimitiveType.Number;

   private IntFunction(Expression valueExpression, SourceReference reference)
     : base(valueExpression, reference)
   {
   }

   public static ExpressionFunction Create(SourceReference reference, Expression expression)
   {
     return new IntFunction(expression, reference);
   }
}
