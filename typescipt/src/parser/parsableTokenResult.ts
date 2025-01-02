

export class ParsableTokenResult extends ParseResult<ParsableToken> {
   public SourceReference reference

   private ParsableTokenResult(ParsableToken result) super(result) {
   }

   private ParsableTokenResult(boolean success, SourceReference sourceReference, string errorMessage) super(success, errorMessage) {
     reference = sourceReference;
   }

   public static success(result: ParsableToken): ParsableTokenResult {
     if (result == null) throw new Error(nameof(result));

     return new ParsableTokenResult(result);
   }

   public static failed(reference: SourceReference, errorMessage: string): ParsableTokenResult {
     return new ParsableTokenResult(false, reference, errorMessage);
   }
}
