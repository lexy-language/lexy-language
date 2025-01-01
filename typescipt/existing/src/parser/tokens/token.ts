

export class Token extends IToken {
   public abstract string Value
   public TokenCharacter FirstCharacter

   constructor(firstCharacter: TokenCharacter) {
     FirstCharacter = firstCharacter ?? throw new Error(nameof(firstCharacter));
   }
}
