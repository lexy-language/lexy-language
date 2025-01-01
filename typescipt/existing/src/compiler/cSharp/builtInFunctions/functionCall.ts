




namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal abstract class FunctionCall
{
   public ExpressionFunction ExpressionFunction { get; }

   protected FunctionCall(ExpressionFunction expressionFunction)
   {
     ExpressionFunction = expressionFunction ?? throw new ArgumentNullException(nameof(expressionFunction));
   }

   public static FunctionCall Create(FunctionCallExpression expression)
   {
     return expression.ExpressionFunction switch
     {
       LookupFunction function => new LookUpFunctionCall(function),
       LookupRowFunction function => new LookUpRowFunctionCall(function),

       IntFunction function => new IntFunctionCall(function),
       AbsFunction function => new AbsFunctionCall(function),
       PowerFunction function => new PowerFunctionCall(function),
       RoundFunction function => new RoundFunctionCall(function),

       NowFunction function => new NowFunctionCall(function),
       TodayFunction function => new TodayFunctionCall(function),

       YearFunction function => new YearFunctionCall(function),
       MonthFunction function => new MonthFunctionCall(function),
       DayFunction function => new DayFunctionCall(function),
       HourFunction function => new HourFunctionCall(function),
       MinuteFunction function => new MinuteFunctionCall(function),
       SecondFunction function => new SecondFunctionCall(function),

       YearsFunction function => new YearsFunctionCall(function),
       MonthsFunction function => new MonthsFunctionCall(function),
       DaysFunction function => new DaysFunctionCall(function),
       HoursFunction function => new HoursFunctionCall(function),
       MinutesFunction function => new MinutesFunctionCall(function),
       SecondsFunction function => new SecondsFunctionCall(function),

       LexyFunction function => new LexyFunctionCall(function),

       _ => null
     };
   }

   public abstract MemberDeclarationSyntax CustomMethodSyntax(ICompileFunctionContext context);

   public abstract ExpressionSyntax CallExpressionSyntax(ICompileFunctionContext context);
}
