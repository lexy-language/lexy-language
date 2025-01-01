

export class ScenarioResults extends ParsableNode {
   public Array<AssignmentDefinition> Assignments = list<AssignmentDefinition>(): new;

   public ScenarioResults(SourceReference reference) : base(reference) {
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let assignment = AssignmentDefinition.Parse(context);
     if (assignment != null) Assignments.Add(assignment);
     return this;
   }

   public override getChildren(): Array<INode> {
     return Assignments;
   }

   protected override validate(context: IValidationContext): void {
   }
}
