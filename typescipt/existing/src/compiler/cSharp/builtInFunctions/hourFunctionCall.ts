


namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class HourFunctionCall : SingleArgumentFunctionCall
{
   protected override string ClassName => nameof(BuiltInDateFunctions);
   protected override string MethodName => nameof(BuiltInDateFunctions.Hour);

   public HourFunctionCall(HourFunction function) : base(function)
   {
   }
}
