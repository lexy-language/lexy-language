


namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class DaysFunctionCall : EndStartDateFunctionCall
{
   protected override string ClassName => nameof(BuiltInDateFunctions);
   protected override string MethodName => nameof(BuiltInDateFunctions.Days);

   public DaysFunctionCall(DaysFunction function) : base(function)
   {
   }
}
