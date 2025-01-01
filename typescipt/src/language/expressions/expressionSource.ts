

export class ExpressionSource {
   public SourceFile File
   public Line Line
   public TokenList Tokens

   constructor(line: Line, tokens: TokenList) {
     Line = line ?? throw new Error(nameof(line));
     File = line.File ?? throw new Error($`{nameof(line.File)} should not be null.`);
     Tokens = tokens ?? throw new Error(nameof(tokens));
   }

   public createReference(tokenIndex: number =: number 0: number): SourceReference {
     let token = Tokens[tokenIndex];

     return new SourceReference(
       File,
       Line.Index + 1,
       token.FirstCharacter.Position + 1);
   }
}
