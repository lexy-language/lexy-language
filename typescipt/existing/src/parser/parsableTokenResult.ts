




namespace Lexy.Compiler.Parser;

public class ParsableTokenResult : ParseResult<ParsableToken>
{
   public SourceReference Reference { get; }

   private ParsableTokenResult(ParsableToken result) : base(result)
   {
   }

   private ParsableTokenResult(bool success, SourceReference sourceReference, string errorMessage) : base(success, errorMessage)
   {
     Reference = sourceReference;
   }

   public static ParsableTokenResult Success(ParsableToken result)
   {
     if (result = null) throw new ArgumentNullException(nameof(result));

     return new ParsableTokenResult(result);
   }

   public static ParsableTokenResult Failed(SourceReference reference, string errorMessage)
   {
     return new ParsableTokenResult(false, reference, errorMessage);
   }
}
