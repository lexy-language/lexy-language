


namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class MinuteFunctionCall : SingleArgumentFunctionCall
{
   protected override string ClassName => nameof(BuiltInDateFunctions);
   protected override string MethodName => nameof(BuiltInDateFunctions.Minute);

   public MinuteFunctionCall(MinuteFunction function) : base(function)
   {
   }
}
