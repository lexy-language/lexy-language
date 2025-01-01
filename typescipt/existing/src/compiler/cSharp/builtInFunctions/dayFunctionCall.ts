


namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class DayFunctionCall : SingleArgumentFunctionCall
{
   protected override string ClassName => nameof(BuiltInDateFunctions);
   protected override string MethodName => nameof(BuiltInDateFunctions.Day);

   public DayFunctionCall(DayFunction function) : base(function)
   {
   }
}
