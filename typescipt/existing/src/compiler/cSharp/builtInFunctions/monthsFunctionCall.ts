


namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class MonthsFunctionCall : EndStartDateFunctionCall
{
   protected override string ClassName => nameof(BuiltInDateFunctions);
   protected override string MethodName => nameof(BuiltInDateFunctions.Months);

   public MonthsFunctionCall(MonthsFunction function) : base(function)
   {
   }
}
