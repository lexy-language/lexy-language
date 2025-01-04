import {SourceReference} from "../parser/sourceReference";


export class Include {
  private isProcessedValue: boolean;
   private readonly reference: SourceReference;

   public get isProcessed(): boolean {
     return this.isProcessedValue;
   }
   public readonly string FileName

   constructor(fileName: string, reference: SourceReference) {
     this.reference = reference;
     FileName = fileName ?? throw new Error(nameof(fileName));
   }

   public static isValid(line: Line): boolean {
     return line.tokens.isKeyword(0, Keywords.Include);
   }

   public static parse(context: IParseLineContext): Include {
     let line = context.line;
     let lineTokens = line.tokens;
     if (lineTokens.length != 2 || !lineTokens.IsQuotedString(1)) {
       context.logger.fail(line.lineStartReference(),
         "Invalid syntax. Expected: 'Include \`FileName\`");
       return null;
     }

     let quotedString = lineTokens.Token<QuotedLiteralToken>(1);

     return new Include(quotedString.Value, line.lineStartReference());
   }

   public process(parentFullFileName: string, context: IParserContext): string {
     IsProcessed = true;
     if (string.IsNullOrEmpty(FileName)) {
       context.logger.fail(reference, `No include file name specified.`);
       return null;
     }

     let directName = Path.GetDirectoryName(parentFullFileName);
     let fullPath = Path.GetFullPath(directName);
     let fullFinName = $`{Path.Combine(fullPath, FileName)}.{LexySourceDocument.FileExtension}`;

     if (!File.Exists(fullFinName)) {
       context.logger.fail(reference, $`Invalid include file name '{FileName}'`);
       return null;
     }

     return fullFinName;
   }
}
