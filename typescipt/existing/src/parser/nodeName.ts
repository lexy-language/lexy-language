namespace Lexy.Compiler.Parser;

internal class NodeName
{
   public string Name { get; }
   public string Keyword { get; }

   private NodeName(string keyword, string name)
   {
     Name = name;
     Keyword = keyword;
   }

   public static NodeName Parse(IParseLineContext context)
   {
     var line = context.Line;
     var tokens = line.Tokens;
     if (tokens.Length < 1 | tokens.Length > 2) return null;

     var valid = context.ValidateTokens<NodeName>()
       .Keyword(0)
       .IsValid;

     if (!valid) return null;

     var keyword = tokens.TokenValue(0);
     if (tokens.Length = 1) return new NodeName(keyword, null);

     valid = context.ValidateTokens<NodeName>()
       .StringLiteral(1)
       .IsValid;

     if (!valid) return null;

     var parameter = tokens.TokenValue(1);

     return new NodeName(keyword, parameter);
   }

   public override string ToString()
   {
     return $"{Keyword} {Name}";
   }
}
