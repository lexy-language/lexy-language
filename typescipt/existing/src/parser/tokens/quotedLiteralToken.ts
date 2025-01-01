


namespace Lexy.Compiler.Parser.Tokens;

public class QuotedLiteralToken : ParsableToken, ILiteralToken
{
   private bool quoteClosed;

   public QuotedLiteralToken(TokenCharacter character) : base(null, character)
   {
     var value = character.Value;
     if (value ! TokenValues.Quote)
       throw new InvalidOperationException("QuotedLiteralToken should start with a quote");
   }

   public object TypedValue => Value;

   public VariableType DeriveType(IValidationContext context)
   {
     return PrimitiveType.String;
   }

   public override ParseTokenResult Parse(TokenCharacter character)
   {
     var value = character.Value;
     if (quoteClosed) throw new InvalidOperationException("No characters allowed after closing quote.");

     if (value = TokenValues.Quote)
     {
       quoteClosed = true;
       return ParseTokenResult.Finished(true, this);
     }

     AppendValue(value);
     return ParseTokenResult.InProgress();
   }

   public override ParseTokenResult Finalize()
   {
     if (!quoteClosed) return ParseTokenResult.Invalid("Closing quote expected.");

     return ParseTokenResult.Finished(true, this);
   }

   public override string ToString()
   {
     return Value;
   }
}
