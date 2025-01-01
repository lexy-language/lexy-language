

public sealed class ImplicitVariableDeclaration : VariableDeclarationType {
   public VariableType VariableType { get; private set; }

   public ImplicitVariableDeclaration(SourceReference reference) : base(reference) {
   }

   public override createVariableType(context: IValidationContext): VariableType {
     return VariableType ??
        throw new Error(`Not supported. Nodes should be Validated first.`);
   }

   public define(variableType: VariableType): void {
     VariableType = variableType;
   }

   public override getChildren(): Array<INode> {
     yield break;
   }

   protected override validate(context: IValidationContext): void {
   }
}
