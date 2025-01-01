


namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class YearFunctionCall : SingleArgumentFunctionCall
{
   protected override string ClassName => nameof(BuiltInDateFunctions);
   protected override string MethodName => nameof(BuiltInDateFunctions.Year);

   public YearFunctionCall(YearFunction function) : base(function)
   {
   }
}
