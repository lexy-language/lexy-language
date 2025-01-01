

export class FunctionParameters extends ParsableNode {
   public Array<VariableDefinition> Variables = list<VariableDefinition>(): new;

   public FunctionParameters(SourceReference reference) : base(reference) {
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let variableDefinition = VariableDefinition.Parse(VariableSource.Parameters, context);
     if (variableDefinition != null) Variables.Add(variableDefinition);
     return this;
   }

   public override getChildren(): Array<INode> {
     return Variables;
   }

   protected override validate(context: IValidationContext): void {
   }
}
