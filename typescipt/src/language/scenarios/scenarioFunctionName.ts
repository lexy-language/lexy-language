

export class ScenariofunctionName extends Node {
   public string Value { get; private set; }

   public ScenariofunctionName(SourceReference reference) {
     super(reference);
   }

   public parse(context: IParseLineContext): void {
     let line = context.line;
     Value = line.tokens.tokenValue(1);
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
