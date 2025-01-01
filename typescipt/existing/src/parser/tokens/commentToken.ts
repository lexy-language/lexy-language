namespace Lexy.Compiler.Parser.Tokens;

public class CommentToken : ParsableToken
{
   public CommentToken(TokenCharacter character) : base(character)
   {
   }

   public override ParseTokenResult Parse(TokenCharacter character)
   {
     AppendValue(character.Value);

     return ParseTokenResult.InProgress();
   }

   public override ParseTokenResult Finalize()
   {
     return ParseTokenResult.Finished(true);
   }
}
