

export class TokenizeResult extends ParseResult<TokenList> {
   public SourceReference Reference

   private TokenizeResult(TokenList result) : base(result) {
   }

   private TokenizeResult(boolean success, SourceReference sourceReference, string errorMessage) : base(success, errorMessage) {
     Reference = sourceReference;
   }

   public static success(result: TokenList): TokenizeResult {
     if (result == null) throw new Error(nameof(result));

     return new TokenizeResult(result);
   }

   public static failed(reference: SourceReference, errorMessage: string): TokenizeResult {
     return new TokenizeResult(false, reference, errorMessage);
   }
}
