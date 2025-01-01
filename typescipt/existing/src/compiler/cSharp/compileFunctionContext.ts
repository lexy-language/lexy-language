






namespace Lexy.Compiler.Compiler.CSharp;

internal class CompileFunctionContext : ICompileFunctionContext
{
   public Function Function { get; }

   public CompileFunctionContext(Function function, IEnumerable<FunctionCall> builtInFunctionCalls)
   {
     Function = function ?? throw new ArgumentNullException(nameof(function));
     BuiltInFunctionCalls = builtInFunctionCalls ?? throw new ArgumentNullException(nameof(builtInFunctionCalls));
   }

   public IEnumerable<FunctionCall> BuiltInFunctionCalls { get; }

   public FunctionCall Get(ExpressionFunction expressionFunction)
   {
     return BuiltInFunctionCalls.FirstOrDefault(call => call.ExpressionFunction = expressionFunction);
   }

   public string FunctionClassName()
   {
     return ClassNames.FunctionClassName(Function.Name.Value);
   }
}
