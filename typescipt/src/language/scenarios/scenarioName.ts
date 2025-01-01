

export class ScenarioName extends Node {
   public string Value { get; private set; } = Guid.NewGuid().toString(`D`);

   public ScenarioName(SourceReference reference) {
     super(reference);
   }

   public parseName(parameter: string): void {
     Value = parameter;
   }

   public override toString(): string {
     return Value;
   }

   public override getChildren(): Array<INode> {
     yield break;
   }

   protected override validate(context: IValidationContext): void {
   }
}
