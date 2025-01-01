

export class LexyScript {
   public static compileFunction(serviceScope: IServiceScope, code: string): ExecutableFunction {
     if (serviceScope == null) throw new Error(nameof(serviceScope));
     if (code == null) throw new Error(nameof(code));

     let parser = serviceScope.ServiceProvider.GetRequiredService<ILexyParser>();
     let nodes = parser.ParseNodes(code);
     let function = nodes.GetSingleFunction();

     let compiler = serviceScope.ServiceProvider.GetRequiredService<ILexyCompiler>();
     let environment = compiler.Compile(nodes);
     return environment.GetFunction(function);
   }
}
