

export class Expression extends Node {
   public ExpressionSource Source

   protected Expression(ExpressionSource source, SourceReference reference) : base(reference) {
     Source = source ?? throw new Error(nameof(source));
   }

   public override toString(): string {
     let writer = new StringWriter();
     foreach (let token in Source.Tokens) writer.Write(token.Value);
     return writer.ToString();
   }

   public abstract deriveType(context: IValidationContext): VariableType;
}
