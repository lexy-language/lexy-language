


namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class HoursFunctionCall : EndStartDateFunctionCall
{
   protected override string ClassName => nameof(BuiltInDateFunctions);
   protected override string MethodName => nameof(BuiltInDateFunctions.Hours);

   public HoursFunctionCall(HoursFunction function) : base(function)
   {
   }
}
