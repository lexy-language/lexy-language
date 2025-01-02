

export class VariableReference {
   public string[] Path
   public string parentIdentifier => Path[0];
   public boolean HasChildIdentifiers => Path.length > 1;
   public number Parts => Path.length;

   constructor(variableName: string) {
     if (variableName == null) throw new Error(nameof(variableName));
     Path = new[] { variableName };
   }

   constructor(variablePath: string[]) {
     Path = variablePath ?? throw new Error(nameof(variablePath));
   }

   public override toString(): string {
     let builder = new StringBuilder();
     foreach (let value in Path) {
       if (builder.length > 0) builder.Append('.');
       builder.Append(value);
     }

     return builder.toString();
   }

   public childrenReference(): VariableReference {
     let parts = Path[1.];
     return new VariableReference(parts);
   }
}
