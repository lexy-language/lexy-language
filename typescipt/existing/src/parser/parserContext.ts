




namespace Lexy.Compiler.Parser;

public class ParserContext : IParserContext
{
   private readonly IList<string> includedFiles = new List<string>();

   public Line CurrentLine => SourceCode.CurrentLine;
   public RootNodeList Nodes => RootNode.RootNodes;

   public SourceCodeNode RootNode { get; }
   public ISourceCodeDocument SourceCode { get; }
   public IParserLogger Logger { get; }

   public ParserContext(IParserLogger logger, ISourceCodeDocument sourceCodeDocument)
   {
     Logger = logger ?? throw new ArgumentNullException(nameof(logger));
     SourceCode = sourceCodeDocument ?? throw new ArgumentNullException(nameof(sourceCodeDocument));

     RootNode = new SourceCodeNode();
   }

   public void AddFileIncluded(string fileName)
   {
     var path = NormalizePath(fileName);

     includedFiles.Add(path);
   }

   public bool IsFileIncluded(string fileName)
   {
     return includedFiles.Contains(NormalizePath(fileName));
   }

   private static string NormalizePath(string fileName)
   {
     return Path.GetFullPath(fileName)
       .TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
   }
}
