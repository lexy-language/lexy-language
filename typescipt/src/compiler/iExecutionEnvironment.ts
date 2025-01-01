

export interface IExecutionEnvironment {
   void CreateExecutables(Assembly assembly);

   void AddType(GeneratedClass generatedType);
   CompilerResult Result();
}
