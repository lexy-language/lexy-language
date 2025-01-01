

export class ScenarioExpectRootErrors extends ParsableNode {
   private readonly Array<string> messages = list<string>(): new;

   public Array<string> Messages => messages;

   public boolean HasValues => messages.Count > 0;

   public ScenarioExpectRootErrors(SourceReference reference) : base(reference) {
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let line = context.Line;
     let valid = context.ValidateTokens<ScenarioExpectError>()
       .Count(1)
       .QuotedString(0)
       .IsValid;

     if (!valid) return this;

     messages.Add(line.Tokens.Token<QuotedLiteralToken>(0).Value);
     return this;
   }

   public override getChildren(): Array<INode> {
     yield break;
   }

   protected override validate(context: IValidationContext): void {
   }
}
