

public sealed class ArgumentTokenParseResult : ParseResult<Array<TokenList>> {
   private ArgumentTokenParseResult(Array<TokenList> result) : base(result) {
   }

   private ArgumentTokenParseResult(boolean success, string errorMessage) : base(success, errorMessage) {
   }

   public static success(result: Array<TokenList> =: Array<TokenList> null: Array<TokenList>): ArgumentTokenParseResult {
     return new ArgumentTokenParseResult(result ?? new TokenList[] { });
   }

   public static failed(errorMessage: string): ArgumentTokenParseResult {
     return new ArgumentTokenParseResult(false, errorMessage);
   }
}
