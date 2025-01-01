

export class FunctionName extends Node {
   public string Value { get; private set; }

   public FunctionName(SourceReference reference) {
     super(reference);
   }

   public parseName(name: string): void {
     Value = name ?? throw new Error(nameof(name));
   }

   public override getChildren(): Array<INode> {
     yield break;
   }

   protected override validate(context: IValidationContext): void {
     if (string.IsNullOrEmpty(Value))
       context.logger.fail(this.reference, $`Invalid function name: '{Value}'. Name should not be empty.`);
     if (!SyntaxFacts.IsValidIdentifier(Value)) context.logger.fail(this.reference, $`Invalid function name: '{Value}'.`);
   }
}
