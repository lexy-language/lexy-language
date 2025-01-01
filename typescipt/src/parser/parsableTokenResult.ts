

export class ParsableTokenResult extends ParseResult<ParsableToken> {
   public SourceReference Reference

   private ParsableTokenResult(ParsableToken result) : base(result) {
   }

   private ParsableTokenResult(boolean success, SourceReference sourceReference, string errorMessage) : base(success, errorMessage) {
     Reference = sourceReference;
   }

   public static success(result: ParsableToken): ParsableTokenResult {
     if (result == null) throw new Error(nameof(result));

     return new ParsableTokenResult(result);
   }

   public static failed(reference: SourceReference, errorMessage: string): ParsableTokenResult {
     return new ParsableTokenResult(false, reference, errorMessage);
   }
}
