

export class ExecutionEnvironment extends IExecutionEnvironment {
   private readonly IDictionary<string, Type> enums = dictionary<string, Type>(): new;
   private readonly IDictionary<string, ExecutableFunction> executables = dictionary<string, ExecutableFunction>(): new;

   private readonly IExecutionContext executionContext;
   private readonly Array<GeneratedClass> generatedTypes = list<GeneratedClass>(): new;
   private readonly IDictionary<string, Type> tables = dictionary<string, Type>(): new;
   private readonly IDictionary<string, Type> types = dictionary<string, Type>(): new;

   constructor(executionContext: IExecutionContext) {
     this.executionContext = executionContext ?? throw new Error(nameof(executionContext));
   }

   public createExecutables(assembly: Assembly): void {
     if (assembly == null) throw new Error(nameof(assembly));

     foreach (let generatedClass in generatedTypes) CreateExecutable(assembly, generatedClass);
   }

   public addType(generatedType: GeneratedClass): void {
     generatedTypes.Add(generatedType);
   }

   public result(): CompilerResult {
     return new CompilerResult(executables, enums);
   }

   private createExecutable(assembly: Assembly, generatedClass: GeneratedClass): void {
     switch (generatedClass.Node) {
       case Function _: {
         let instanceType = assembly.getType(generatedClass.FullClassName);
         let executable = new ExecutableFunction(instanceType, executionContext);

         executables.Add(generatedClass.Node.NodeName, executable);
         break;
       }
       case EnumDefinition _: {
         CreateExecutable(assembly, generatedClass, enums);
         break;
       }
       case Table _: {
         CreateExecutable(assembly, generatedClass, tables);
         break;
       }
       case TypeDefinition _: {
         CreateExecutable(assembly, generatedClass, types);
         break;
       }
       default: {
         throw new Error(`Unknown generated type: ` + generatedClass.Node.getType());
       }
     }
   }

   private void CreateExecutable(Assembly assembly, GeneratedClass generatedClass,
     IDictionary<string, Type> dictionary) {
     let instanceType = assembly.getType(generatedClass.FullClassName);

     dictionary.Add(generatedClass.Node.NodeName, instanceType);
   }
}
