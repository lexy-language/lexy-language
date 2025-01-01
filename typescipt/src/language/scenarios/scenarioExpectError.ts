

export class ScenarioExpectError extends ParsableNode {
   public string Message { get; private set; }
   public boolean HasValue => Message != null;

   public ScenarioExpectError(SourceReference reference) : base(reference) {
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let line = context.Line;

     let valid = context.ValidateTokens<ScenarioExpectError>()
       .Count(2)
       .Keyword(0)
       .QuotedString(1)
       .IsValid;

     if (!valid) return this;

     Message = line.Tokens.Token<QuotedLiteralToken>(1).Value;
     return this;
   }

   public override getChildren(): Array<INode> {
     yield break;
   }

   protected override validate(context: IValidationContext): void {
   }
}
