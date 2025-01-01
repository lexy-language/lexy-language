

export class ColumnHeader extends Node {
   public string Name
   public VariableDeclarationType Type

   public ColumnHeader(string name, VariableDeclarationType type, SourceReference reference) {
     super(reference);
     Name = name;
     Type = type;
   }

   public static parse(name: string, typeName: string, reference: SourceReference): ColumnHeader {
     let type = VariableDeclarationType.parse(typeName, reference);
     return new ColumnHeader(name, type, reference);
   }

   public override getChildren(): Array<INode> {
     yield return Type;
   }

   protected override validate(context: IValidationContext): void {
   }
}
