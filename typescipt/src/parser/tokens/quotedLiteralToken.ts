

export class QuotedLiteralToken extends ParsableToken, ILiteralToken {
   private boolean quoteClosed;

   public QuotedLiteralToken(TokenCharacter character) : base(null, character) {
     let value = character.Value;
     if (value != TokenValues.Quote)
       throw new Error(`QuotedLiteralToken should start with a quote`);
   }

   public object TypedValue => Value;

   public deriveType(context: IValidationContext): VariableType {
     return PrimitiveType.String;
   }

   public override parse(character: TokenCharacter): ParseTokenResult {
     let value = character.Value;
     if (quoteClosed) throw new Error(`No characters allowed after closing quote.`);

     if (value == TokenValues.Quote) {
       quoteClosed = true;
       return ParseTokenResult.Finished(true, this);
     }

     AppendValue(value);
     return ParseTokenResult.InProgress();
   }

   public override finalize(): ParseTokenResult {
     if (!quoteClosed) return ParseTokenResult.Invalid(`Closing quote expected.`);

     return ParseTokenResult.Finished(true, this);
   }

   public override toString(): string {
     return Value;
   }
}
