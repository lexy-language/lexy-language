


namespace Lexy.Compiler.Language.Expressions.Functions;

public class SecondFunction : SingleArgumentFunction
{
   public const string Name = "SECOND";

   protected override string FunctionHelp => $"'{Name} expects 1 argument (Date)";

   protected override VariableType ArgumentType => PrimitiveType.Date;
   protected override VariableType ResultType => PrimitiveType.Number;

   private SecondFunction(Expression valueExpression, SourceReference reference)
     : base(valueExpression, reference)
   {
   }

   public static ExpressionFunction Create(SourceReference reference, Expression expression)
   {
     return new SecondFunction(expression, reference);
   }
}
