



namespace Lexy.Compiler.Compiler;

public class CompilerResult
{
   private readonly IDictionary<string, Type> enums;
   private readonly IDictionary<string, ExecutableFunction> executables;

   public CompilerResult(IDictionary<string, ExecutableFunction> executables, IDictionary<string, Type> enums)
   {
     this.executables = executables;
     this.enums = enums;
   }

   public ExecutableFunction GetFunction(Function function)
   {
     return executables[function.NodeName];
   }

   public bool ContainsEnum(string type)
   {
     return enums.ContainsKey(type);
   }

   public Type GetEnumType(string type)
   {
     return enums[type];
   }
}
