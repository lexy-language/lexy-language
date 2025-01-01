


namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class MinutesFunctionCall : EndStartDateFunctionCall
{
   protected override string ClassName => nameof(BuiltInDateFunctions);
   protected override string MethodName => nameof(BuiltInDateFunctions.Minutes);

   public MinutesFunctionCall(MinutesFunction function) : base(function)
   {
   }
}
