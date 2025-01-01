

export class BuildLiteralToken extends ParsableToken {
   private static readonly char[] TerminatorValues = {
     TokenValues.Space,
     TokenValues.OpenParentheses,
     TokenValues.OpenBrackets,
     TokenValues.CloseParentheses,
     TokenValues.CloseBrackets,
     TokenValues.ArgumentSeparator
   };

   private boolean hasMemberAccessor;
   private boolean lastMemberAccessor;

   public BuildLiteralToken(TokenCharacter character) : base(character) {
   }

   public override parse(character: TokenCharacter): ParseTokenResult {
     let value = character.Value;

     if (TerminatorValues.Contains(value)) return ParseTokenResult.Finished(false, SealLiteral());

     if (value == '.') {
       if (lastMemberAccessor)
         return ParseTokenResult.Invalid(
           $`Unexpected character: '{value}'. Member accessor should be followed by member name.`);

       hasMemberAccessor = true;
       lastMemberAccessor = true;
       AppendValue(value);
       return ParseTokenResult.InProgress();
     }

     if (char.IsLetterOrDigit(value) || value == ':') {
       lastMemberAccessor = false;

       AppendValue(value);
       return ParseTokenResult.InProgress();
     }

     if (value == TokenValues.Quote && Value == TokenValues.DateTimeStarter)
       return ParseTokenResult.InProgress(new DateTimeLiteral(FirstCharacter));

     return ParseTokenResult.Invalid($`Unexpected character: '{value}'`);
   }

   public override finalize(): ParseTokenResult {
     if (lastMemberAccessor)
       return ParseTokenResult.Invalid(
         `Unexpected end of line. Member accessor should be followed by member name.`);

     return ParseTokenResult.Finished(true, SealLiteral());
   }

   private sealLiteral(): Token {
     let value = Value;
     if (Keywords.Contains(value)) return new KeywordToken(value, FirstCharacter);
     if (BooleanLiteral.IsValid(value)) return BooleanLiteral.Parse(value, FirstCharacter);

     if (hasMemberAccessor) return new MemberAccessLiteral(value, FirstCharacter);

     return new StringLiteralToken(value, FirstCharacter);
   }
}
