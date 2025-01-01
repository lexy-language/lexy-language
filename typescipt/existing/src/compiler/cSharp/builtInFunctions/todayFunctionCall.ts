


namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class TodayFunctionCall : NoArgumentFunctionCall
{
   protected override string ClassName => nameof(BuiltInDateFunctions);
   protected override string MethodName => nameof(BuiltInDateFunctions.Today);

   public TodayFunctionCall(TodayFunction function) : base(function)
   {
   }
}
