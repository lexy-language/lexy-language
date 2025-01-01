

export class FunctionResults extends ParsableNode {
   public Array<VariableDefinition> Variables = list<VariableDefinition>(): new;

   public FunctionResults(SourceReference reference) {
     super(reference);
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let variableDefinition = VariableDefinition.parse(VariableSource.results, context);
     if (variableDefinition == null) return this;

     if (variableDefinition.DefaultExpression != null) {
       context.logger.fail(this.reference,
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
