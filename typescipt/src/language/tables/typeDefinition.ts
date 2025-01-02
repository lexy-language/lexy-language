

export class TypeDefinition extends RootNode {
   public TypeName Name new(): =;
   public override string NodeName => Name.Value;

   public Array<VariableDefinition> Variables = list<VariableDefinition>(): new;

   private TypeDefinition(string name, SourceReference reference) {
     super(reference);
     Name.ParseName(name);
   }

   internal static parse(name: NodeName, reference: SourceReference): TypeDefinition {
     return new TypeDefinition(name.Name, reference);
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let variableDefinition = VariableDefinition.parse(VariableSource.Parameters, context);
     if (variableDefinition != null) Variables.Add(variableDefinition);
     return this;
   }

   public override getChildren(): Array<INode> {
     return Variables;
   }

   protected override validate(context: IValidationContext): void {
   }

   public override validateTree(context: IValidationContext): void {
     using (context.CreateVariableScope()) {
       base.validateTree(context);
     }
   }
}
