


namespace Lexy.Compiler.Language.Expressions.Functions;

public class DayFunction : SingleArgumentFunction
{
   public const string Name = "DAY";

   protected override string FunctionHelp => $"'{Name} expects 1 argument (Date)";

   protected override VariableType ArgumentType => PrimitiveType.Date;
   protected override VariableType ResultType => PrimitiveType.Number;

   private DayFunction(Expression valueExpression, SourceReference reference)
     : base(valueExpression, reference)
   {
   }

   public static ExpressionFunction Create(SourceReference reference, Expression expression)
   {
     return new DayFunction(expression, reference);
   }
}
