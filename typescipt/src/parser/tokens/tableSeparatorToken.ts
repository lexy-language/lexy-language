
export class TableSeparatorToken extends ParsableToken {
   public TableSeparatorToken(TokenCharacter character) : base(character) {
   }

   public override parse(character: TokenCharacter): ParseTokenResult {
     return ParseTokenResult.Finished(true);
   }

   public override finalize(): ParseTokenResult {
     return ParseTokenResult.Finished(true);
   }
}
