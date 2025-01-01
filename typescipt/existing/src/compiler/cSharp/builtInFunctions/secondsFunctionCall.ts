


namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class SecondsFunctionCall : EndStartDateFunctionCall
{
   protected override string ClassName => nameof(BuiltInDateFunctions);
   protected override string MethodName => nameof(BuiltInDateFunctions.Seconds);

   public SecondsFunctionCall(SecondsFunction function) : base(function)
   {
   }
}
