


namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class NowFunctionCall : NoArgumentFunctionCall
{
   protected override string ClassName => nameof(BuiltInDateFunctions);
   protected override string MethodName => nameof(BuiltInDateFunctions.Now);

   public NowFunctionCall(NowFunction function) : base(function)
   {
   }
}
