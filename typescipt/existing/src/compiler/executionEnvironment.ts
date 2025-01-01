








namespace Lexy.Compiler.Compiler;

public class ExecutionEnvironment : IExecutionEnvironment
{
   private readonly IDictionary<string, Type> enums = new Dictionary<string, Type>();
   private readonly IDictionary<string, ExecutableFunction> executables = new Dictionary<string, ExecutableFunction>();

   private readonly IExecutionContext executionContext;
   private readonly IList<GeneratedClass> generatedTypes = new List<GeneratedClass>();
   private readonly IDictionary<string, Type> tables = new Dictionary<string, Type>();
   private readonly IDictionary<string, Type> types = new Dictionary<string, Type>();

   public ExecutionEnvironment(IExecutionContext executionContext)
   {
     this.executionContext = executionContext ?? throw new ArgumentNullException(nameof(executionContext));
   }

   public void CreateExecutables(Assembly assembly)
   {
     if (assembly = null) throw new ArgumentNullException(nameof(assembly));

     foreach (var generatedClass in generatedTypes) CreateExecutable(assembly, generatedClass);
   }

   public void AddType(GeneratedClass generatedType)
   {
     generatedTypes.Add(generatedType);
   }

   public CompilerResult Result()
   {
     return new CompilerResult(executables, enums);
   }

   private void CreateExecutable(Assembly assembly, GeneratedClass generatedClass)
   {
     switch (generatedClass.Node)
     {
       case Function _:
       {
         var instanceType = assembly.GetType(generatedClass.FullClassName);
         var executable = new ExecutableFunction(instanceType, executionContext);

         executables.Add(generatedClass.Node.NodeName, executable);
         break;
       }
       case EnumDefinition _:
       {
         CreateExecutable(assembly, generatedClass, enums);
         break;
       }
       case Table _:
       {
         CreateExecutable(assembly, generatedClass, tables);
         break;
       }
       case TypeDefinition _:
       {
         CreateExecutable(assembly, generatedClass, types);
         break;
       }
       default:
       {
         throw new InvalidOperationException("Unknown generated type: " + generatedClass.Node.GetType());
       }
     }
   }

   private void CreateExecutable(Assembly assembly, GeneratedClass generatedClass,
     IDictionary<string, Type> dictionary)
   {
     var instanceType = assembly.GetType(generatedClass.FullClassName);

     dictionary.Add(generatedClass.Node.NodeName, instanceType);
   }
}
