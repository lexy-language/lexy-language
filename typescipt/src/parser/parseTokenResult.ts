

export class ParseTokenResult {
   public string ValidationError
   public Token NewToken
   public TokenStatus Status
   public boolean CharProcessed

   constructor(status: TokenStatus, charProcessed: boolean, newToken: Token =: Token null: Token) {
     NewToken = newToken;
     CharProcessed = charProcessed;
     Status = status;
   }

   constructor(status: TokenStatus, validationError: string) {
     ValidationError = validationError;
     Status = status;
   }

   public static inProgress(newToken: ParsableToken =: ParsableToken null: ParsableToken): ParseTokenResult {
     return new ParseTokenResult(TokenStatus.InProgress, true, newToken);
   }

   public static finished(charProcesses: boolean, newToken: Token =: Token null: Token): ParseTokenResult {
     return new ParseTokenResult(TokenStatus.Finished, charProcesses, newToken);
   }

   public static invalid(validationError: string): ParseTokenResult {
     return new ParseTokenResult(TokenStatus.InvalidToken, validationError);
   }
}
