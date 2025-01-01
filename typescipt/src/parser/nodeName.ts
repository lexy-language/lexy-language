
export class NodeName {
   public string Name
   public string Keyword

   constructor(keyword: string, name: string) {
     Name = name;
     Keyword = keyword;
   }

   public static parse(context: IParseLineContext): NodeName {
     let line = context.Line;
     let tokens = line.Tokens;
     if (tokens.Length < 1 || tokens.Length > 2) return null;

     let valid = context.ValidateTokens<NodeName>()
       .Keyword(0)
       .IsValid;

     if (!valid) return null;

     let keyword = tokens.TokenValue(0);
     if (tokens.Length == 1) return new NodeName(keyword, null);

     valid = context.ValidateTokens<NodeName>()
       .StringLiteral(1)
       .IsValid;

     if (!valid) return null;

     let parameter = tokens.TokenValue(1);

     return new NodeName(keyword, parameter);
   }

   public override toString(): string {
     return $`{Keyword} {Name}`;
   }
}
