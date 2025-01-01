




namespace Lexy.Compiler.Language;

public class Include
{
   private readonly SourceReference reference;

   public bool IsProcessed { get; private set; }
   public string FileName { get; }

   private Include(string fileName, SourceReference reference)
   {
     this.reference = reference;
     FileName = fileName ?? throw new ArgumentNullException(nameof(fileName));
   }

   public static bool IsValid(Line line)
   {
     return line.Tokens.IsKeyword(0, Keywords.Include);
   }

   public static Include Parse(IParseLineContext context)
   {
     var line = context.Line;
     var lineTokens = line.Tokens;
     if (lineTokens.Length ! 2 | !lineTokens.IsQuotedString(1))
     {
       context.Logger.Fail(line.LineStartReference(),
         "Invalid syntax. Expected: 'Include \"FileName\"");
       return null;
     }

     var quotedString = lineTokens.Token<QuotedLiteralToken>(1);

     return new Include(quotedString.Value, line.LineStartReference());
   }

   public string Process(string parentFullFileName, IParserContext context)
   {
     IsProcessed = true;
     if (string.IsNullOrEmpty(FileName))
     {
       context.Logger.Fail(reference, "No include file name specified.");
       return null;
     }

     var directName = Path.GetDirectoryName(parentFullFileName);
     var fullPath = Path.GetFullPath(directName);
     var fullFinName = $"{Path.Combine(fullPath, FileName)}.{LexySourceDocument.FileExtension}";

     if (!File.Exists(fullFinName))
     {
       context.Logger.Fail(reference, $"Invalid include file name '{FileName}'");
       return null;
     }

     return fullFinName;
   }
}
