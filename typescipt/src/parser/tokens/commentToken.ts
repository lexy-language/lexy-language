
export class CommentToken extends ParsableToken {
   public CommentToken(TokenCharacter character) : base(character) {
   }

   public override parse(character: TokenCharacter): ParseTokenResult {
     AppendValue(character.Value);

     return ParseTokenResult.InProgress();
   }

   public override finalize(): ParseTokenResult {
     return ParseTokenResult.Finished(true);
   }
}
