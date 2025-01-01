


namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class IntFunctionCall : SingleArgumentFunctionCall
{
   protected override string ClassName => nameof(BuiltInNumberFunctions);
   protected override string MethodName => nameof(BuiltInNumberFunctions.Int);

   public IntFunctionCall(IntFunction function) : base(function)
   {
   }
}
