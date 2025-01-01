

export class ParsableToken extends Token {
   private readonly StringBuilder valueBuilder;

   public override string Value =valueBuilder.ToString(): >;

   protected ParsableToken(TokenCharacter character) : base(character) {
     if (character == null) throw new Error(nameof(character));
     valueBuilder = new StringBuilder(character.Value.ToString());
   }

   protected ParsableToken(string value, TokenCharacter position) : base(position) {
     valueBuilder = new StringBuilder(value);
   }

   protected appendValue(value: char): void {
     valueBuilder.Append(value);
   }

   public abstract parse(character: TokenCharacter): ParseTokenResult;

   public abstract finalize(): ParseTokenResult;
}
