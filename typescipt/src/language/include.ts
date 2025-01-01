

export class Include {
   private readonly SourceReference reference;

   public boolean IsProcessed { get; private set; }
   public string FileName

   constructor(fileName: string, reference: SourceReference) {
     this.reference = reference;
     FileName = fileName ?? throw new Error(nameof(fileName));
   }

   public static isValid(line: Line): boolean {
     return line.Tokens.IsKeyword(0, Keywords.Include);
   }

   public static parse(context: IParseLineContext): Include {
     let line = context.Line;
     let lineTokens = line.Tokens;
     if (lineTokens.Length != 2 || !lineTokens.IsQuotedString(1)) {
       context.Logger.Fail(line.LineStartReference(),
         `Invalid syntax. Expected: 'Include \`FileName\``);
       return null;
     }

     let quotedString = lineTokens.Token<QuotedLiteralToken>(1);

     return new Include(quotedString.Value, line.LineStartReference());
   }

   public process(parentFullFileName: string, context: IParserContext): string {
     IsProcessed = true;
     if (string.IsNullOrEmpty(FileName)) {
       context.Logger.Fail(reference, `No include file name specified.`);
       return null;
     }

     let directName = Path.GetDirectoryName(parentFullFileName);
     let fullPath = Path.GetFullPath(directName);
     let fullFinName = $`{Path.Combine(fullPath, FileName)}.{LexySourceDocument.FileExtension}`;

     if (!File.Exists(fullFinName)) {
       context.Logger.Fail(reference, $`Invalid include file name '{FileName}'`);
       return null;
     }

     return fullFinName;
   }
}
