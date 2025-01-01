

export class TokenTestExtensions {
   public static validateStringLiteralToken(token: Token, value: string): void {
     if (token == null) throw new Error(nameof(token));
     token.ValidateOfType<StringLiteralToken>(actual => ShouldBeStringTestExtensions.ShouldBe(actual.Value, value));
   }
}
