namespace Lexy.Compiler.Parser.Tokens;

public class KeywordToken : Token
{
   public override string Value { get; }

   public KeywordToken(string keyword, TokenCharacter character) : base(character)
   {
     Value = keyword;
   }
}
