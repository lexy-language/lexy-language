

export class ScenarioName extends Node {
   public string Value { get; private set; } = Guid.NewGuid().ToString(`D`);

   public ScenarioName(SourceReference reference) : base(reference) {
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
