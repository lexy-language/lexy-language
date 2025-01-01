

export class VariableDeclarationType extends Node {
   public VariableType VariableType { get; protected set; }

   protected VariableDeclarationType(SourceReference reference) : base(reference) {
   }

   public static parse(type: string, reference: SourceReference): VariableDeclarationType {
     if (reference == null) throw new Error(nameof(reference));

     if (type == Keywords.ImplicitVariableDeclaration) return new ImplicitVariableDeclaration(reference);
     if (TypeNames.Contains(type)) return new PrimitiveVariableDeclarationType(type, reference);

     return new CustomVariableDeclarationType(type, reference);
   }

   public abstract createVariableType(context: IValidationContext): VariableType;
}
