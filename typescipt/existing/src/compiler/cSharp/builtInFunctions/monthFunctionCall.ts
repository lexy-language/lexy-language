


namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class MonthFunctionCall : SingleArgumentFunctionCall
{
   protected override string ClassName => nameof(BuiltInDateFunctions);
   protected override string MethodName => nameof(BuiltInDateFunctions.Month);

   public MonthFunctionCall(MonthFunction function) : base(function)
   {
   }
}
