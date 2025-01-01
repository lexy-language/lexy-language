


namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class AbsFunctionCall : SingleArgumentFunctionCall
{
   protected override string ClassName => nameof(BuiltInNumberFunctions);
   protected override string MethodName => nameof(BuiltInNumberFunctions.Abs);

   public AbsFunctionCall(AbsFunction function) : base(function)
   {
   }
}
