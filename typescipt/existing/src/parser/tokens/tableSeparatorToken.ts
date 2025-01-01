namespace Lexy.Compiler.Parser.Tokens;

public class TableSeparatorToken : ParsableToken
{
   public TableSeparatorToken(TokenCharacter character) : base(character)
   {
   }

   public override ParseTokenResult Parse(TokenCharacter character)
   {
     return ParseTokenResult.Finished(true);
   }

   public override ParseTokenResult Finalize()
   {
     return ParseTokenResult.Finished(true);
   }
}
