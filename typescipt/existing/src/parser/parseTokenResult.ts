

namespace Lexy.Compiler.Parser;

public class ParseTokenResult
{
   public string ValidationError { get; }
   public Token NewToken { get; }
   public TokenStatus Status { get; }
   public bool CharProcessed { get; }

   private ParseTokenResult(TokenStatus status, bool charProcessed, Token newToken = null)
   {
     NewToken = newToken;
     CharProcessed = charProcessed;
     Status = status;
   }

   private ParseTokenResult(TokenStatus status, string validationError)
   {
     ValidationError = validationError;
     Status = status;
   }

   public static ParseTokenResult InProgress(ParsableToken newToken = null)
   {
     return new ParseTokenResult(TokenStatus.InProgress, true, newToken);
   }

   public static ParseTokenResult Finished(bool charProcesses, Token newToken = null)
   {
     return new ParseTokenResult(TokenStatus.Finished, charProcesses, newToken);
   }

   public static ParseTokenResult Invalid(string validationError)
   {
     return new ParseTokenResult(TokenStatus.InvalidToken, validationError);
   }
}
