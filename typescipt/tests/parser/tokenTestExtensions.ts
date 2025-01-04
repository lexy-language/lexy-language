

export class TokenTestExtensions {
   public static validateStringLiteralToken(token: Token, value: string): void {
     if (token == null) throw new Error(nameof(token));
     token.validateOfType<StringLiteralToken>(actual => ShouldBeStringTestExtensions.toBe(actual.Value, value));
   }
}
