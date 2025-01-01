


namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class SecondFunctionCall : SingleArgumentFunctionCall
{
   protected override string ClassName => nameof(BuiltInDateFunctions);
   protected override string MethodName => nameof(BuiltInDateFunctions.Second);

   public SecondFunctionCall(SecondFunction function) : base(function)
   {
   }
}
