

export class ScenarioFunctionName extends Node {
   public string Value { get; private set; }

   public ScenarioFunctionName(SourceReference reference) : base(reference) {
   }

   public parse(context: IParseLineContext): void {
     let line = context.Line;
     Value = line.Tokens.TokenValue(1);
   }

   public override toString(): string {
     return Value;
   }

   public override getChildren(): Array<INode> {
     yield break;
   }

   protected override validate(context: IValidationContext): void {
   }

   public isEmpty(): boolean {
     return string.IsNullOrEmpty(Value);
   }
}
