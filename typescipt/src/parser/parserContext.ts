

export class ParserContext extends IParserContext {
   private readonly Array<string> includedFiles = list<string>(): new;

   public Line CurrentLine => SourceCode.CurrentLine;
   public RootNodeList Nodes => RootNode.RootNodes;

   public SourceCodeNode RootNode
   public ISourceCodeDocument SourceCode
   public IParserLogger Logger

   constructor(logger: IParserLogger, sourceCodeDocument: ISourceCodeDocument) {
     Logger = logger ?? throw new Error(nameof(logger));
     SourceCode = sourceCodeDocument ?? throw new Error(nameof(sourceCodeDocument));

     RootNode = new SourceCodeNode();
   }

   public addFileIncluded(fileName: string): void {
     let path = NormalizePath(fileName);

     includedFiles.Add(path);
   }

   public isFileIncluded(fileName: string): boolean {
     return includedFiles.contains(NormalizePath(fileName));
   }

   private static normalizePath(fileName: string): string {
     return Path.GetFullPath(fileName)
       .TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
   }
}
