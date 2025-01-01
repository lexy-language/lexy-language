

export class FunctionResults extends ParsableNode {
   public Array<VariableDefinition> Variables = list<VariableDefinition>(): new;

   public FunctionResults(SourceReference reference) : base(reference) {
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let variableDefinition = VariableDefinition.Parse(VariableSource.Results, context);
     if (variableDefinition == null) return this;

     if (variableDefinition.DefaultExpression != null) {
       context.Logger.Fail(Reference,
         $`Result variable '{variableDefinition.Name}' should not have a default value.`);
       return this;
     }

     Variables.Add(variableDefinition);

     return this;
   }

   public override getChildren(): Array<INode> {
     return Variables;
   }

   protected override validate(context: IValidationContext): void {
   }
}
