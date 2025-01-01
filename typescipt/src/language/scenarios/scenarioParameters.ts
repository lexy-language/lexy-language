

export class ScenarioParameters extends ParsableNode {
   public Array<AssignmentDefinition> Assignments = list<AssignmentDefinition>(): new;

   public ScenarioParameters(SourceReference reference) {
     super(reference);
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let assignment = AssignmentDefinition.parse(context);
     if (assignment != null) Assignments.Add(assignment);
     return this;
   }

   public override getChildren(): Array<INode> {
     return Assignments;
   }

   protected override validate(context: IValidationContext): void {
   }
}
