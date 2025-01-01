
export class WhitespaceToken extends ParsableToken {
   public WhitespaceToken(TokenCharacter character) : base(character) {
   }

   public override parse(character: TokenCharacter): ParseTokenResult {
     let value = character.Value;
     return !char.IsWhiteSpace(value)
       ? ParseTokenResult.Finished(false)
       : ParseTokenResult.InProgress();
   }

   public override finalize(): ParseTokenResult {
     return ParseTokenResult.Finished(true);
   }
}
