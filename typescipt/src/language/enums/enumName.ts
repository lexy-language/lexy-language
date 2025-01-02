

export class EnumName extends Node {
   public string Value { get; private set; }

   public EnumName(SourceReference sourceReference) super(sourceReference) {
   }

   public parseName(parameter: string): void {
     Value = parameter;
   }

   public override getChildren(): Array<INode> {
     yield break;
   }

   protected override validate(context: IValidationContext): void {
     if (string.IsNullOrEmpty(Value))
       context.logger.fail(this.reference, $`Invalid enum name: {Value}. Name should not be empty.`);
     if (!SyntaxFacts.IsValidIdentifier(Value)) context.logger.fail(this.reference, $`Invalid enum name: {Value}.`);
   }
}
