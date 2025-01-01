

export class TokenFactory {
   public static string(value: string): StringLiteralToken {
     return new StringLiteralToken(value, TestTokenCharacter.Dummy);
   }
}
