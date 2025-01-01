


namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class YearsFunctionCall : EndStartDateFunctionCall
{
   protected override string ClassName => nameof(BuiltInDateFunctions);
   protected override string MethodName => nameof(BuiltInDateFunctions.Years);

   public YearsFunctionCall(YearsFunction function) : base(function)
   {
   }
}
