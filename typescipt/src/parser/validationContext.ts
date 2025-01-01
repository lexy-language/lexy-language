

export class ValidationContext extends IValidationContext {
   private readonly Stack<IVariableContext> contexts new(): =;
   private IVariableContext variableContext;

   public IParserLogger Logger
   public RootNodeList RootNodes

   constructor(logger: IParserLogger, rootNodes: RootNodeList) {
     Logger = logger ?? throw new Error(nameof(logger));
     RootNodes = rootNodes ?? throw new Error(nameof(rootNodes));
   }


   public IVariableContext VariableContext {
     get {
       if (variableContext == null) throw new Error(`FunctionCodeContext not set.`);
       return variableContext;
     }
   }


   public createVariableScope(): IDisposable {
     if (variableContext != null) contexts.Push(variableContext);

     variableContext = new VariableContext(Logger, variableContext);

     return new CodeContextScope(() => { return variableContext = contexts.Count == 0 ? null : contexts.Pop(); });
   }

   private class CodeContextScope : IDisposable {
     private readonly Func<IVariableContext> func;

     codeContextScope(func: Func<IVariableContext>): public {
       this.func = func;
     }

     public dispose(): void {
       func();
     }
   }
}
