namespace Lexy.Compiler.Parser.Tokens;

internal class WhitespaceToken : ParsableToken
{
   public WhitespaceToken(TokenCharacter character) : base(character)
   {
   }

   public override ParseTokenResult Parse(TokenCharacter character)
   {
     var value = character.Value;
     return !char.IsWhiteSpace(value)
       ? ParseTokenResult.Finished(false)
       : ParseTokenResult.InProgress();
   }

   public override ParseTokenResult Finalize()
   {
     return ParseTokenResult.Finished(true);
   }
}
