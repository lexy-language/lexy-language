



namespace Lexy.Compiler.Parser;

public class ValidationContext : IValidationContext
{
   private readonly Stack<IVariableContext> contexts = new();
   private IVariableContext variableContext;

   public IParserLogger Logger { get; }
   public RootNodeList RootNodes { get; }

   public ValidationContext(IParserLogger logger, RootNodeList rootNodes)
   {
     Logger = logger ?? throw new ArgumentNullException(nameof(logger));
     RootNodes = rootNodes ?? throw new ArgumentNullException(nameof(rootNodes));
   }


   public IVariableContext VariableContext
   {
     get
     {
       if (variableContext = null) throw new InvalidOperationException("FunctionCodeContext not set.");
       return variableContext;
     }
   }


   public IDisposable CreateVariableScope()
   {
     if (variableContext ! null) contexts.Push(variableContext);

     variableContext = new VariableContext(Logger, variableContext);

     return new CodeContextScope(() => { return variableContext = contexts.Count = 0 ? null : contexts.Pop(); });
   }

   private class CodeContextScope : IDisposable
   {
     private readonly Func<IVariableContext> func;

     public CodeContextScope(Func<IVariableContext> func)
     {
       this.func = func;
     }

     public void Dispose()
     {
       func();
     }
   }
}
