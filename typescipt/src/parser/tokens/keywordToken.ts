
export class KeywordToken extends Token {
   public override string Value

   public KeywordToken(string keyword, TokenCharacter character) : base(character) {
     Value = keyword;
   }
}
