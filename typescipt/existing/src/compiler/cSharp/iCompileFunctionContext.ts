



namespace Lexy.Compiler.Compiler.CSharp;

internal interface ICompileFunctionContext
{
   IEnumerable<FunctionCall> BuiltInFunctionCalls { get; }

   FunctionCall Get(ExpressionFunction expressionExpressionFunction);
}
