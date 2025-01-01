

export class CompileFunctionContext extends ICompileFunctionContext {
   public Function Function

   constructor(function: Function, builtInFunctionCalls: Array<FunctionCall>) {
     Function = function ?? throw new Error(nameof(function));
     BuiltInFunctionCalls = builtInFunctionCalls ?? throw new Error(nameof(builtInFunctionCalls));
   }

   public Array<FunctionCall> BuiltInFunctionCalls

   public get(expressionFunction: ExpressionFunction): FunctionCall {
     return BuiltInFunctionCalls.FirstOrDefault(call => call.ExpressionFunction == expressionFunction);
   }

   public functionClassName(): string {
     return ClassNames.FunctionClassName(Function.Name.Value);
   }
}
