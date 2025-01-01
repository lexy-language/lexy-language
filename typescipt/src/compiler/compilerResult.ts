

export class CompilerResult {
   private readonly IDictionary<string, Type> enums;
   private readonly IDictionary<string, ExecutableFunction> executables;

   constructor(executables: IDictionary<string, ExecutableFunction>, enums: IDictionary<string, Type>) {
     this.executables = executables;
     this.enums = enums;
   }

   public getFunction(function: Function): ExecutableFunction {
     return executables[function.NodeName];
   }

   public containsEnum(type: string): boolean {
     return enums.containsKey(type);
   }

   public getEnumType(type: string): Type {
     return enums[type];
   }
}
