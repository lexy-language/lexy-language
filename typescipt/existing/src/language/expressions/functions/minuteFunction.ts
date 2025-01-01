


namespace Lexy.Compiler.Language.Expressions.Functions;

public class MinuteFunction : SingleArgumentFunction
{
   public const string Name = "MINUTE";

   protected override string FunctionHelp => $"'{Name} expects 1 argument (Date)";

   protected override VariableType ArgumentType => PrimitiveType.Date;
   protected override VariableType ResultType => PrimitiveType.Number;

   private MinuteFunction(Expression valueExpression, SourceReference reference)
     : base(valueExpression, reference)
   {
   }

   public static ExpressionFunction Create(SourceReference reference, Expression expression)
   {
     return new MinuteFunction(expression, reference);
   }
}
