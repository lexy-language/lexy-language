

export class LexyParser extends ILexyParser {
   private readonly ITokenizer tokenizer;
   private readonly IParserContext context;
   private readonly IParserLogger logger;
   private readonly ISourceCodeDocument sourceCodeDocument;

   constructor(parserContext: IParserContext, sourceCodeDocument: ISourceCodeDocument, logger: IParserLogger, tokenizer: ITokenizer) {
     context = parserContext ?? throw new Error(nameof(parserContext));
     this.sourceCodeDocument = sourceCodeDocument ?? throw new Error(nameof(sourceCodeDocument));
     this.logger = logger ?? throw new Error(nameof(logger));
     this.tokenizer = tokenizer ?? throw new Error(nameof(tokenizer));
   }

   public parseFile(fileName: string, throwException: boolean =: boolean true: boolean): ParserResult {
     logger.LogInfo(`Parse file: ` + fileName);

     let code = File.ReadAllLines(fileName);
     return Parse(code, fileName, throwException);
   }

   public parse(code: string[], fullFileName: string, throwException: boolean =: boolean true: boolean): ParserResult {
     if (code == null) throw new Error(nameof(code));

     context.AddFileIncluded(fullFileName);

     ParseDocument(code, fullFileName);

     logger.LogNodes(context.Nodes);

     ValidateNodesTree();
     DetectCircularDependencies();

     if (throwException) logger.AssertNoErrors();

     return new ParserResult(context.Nodes);
   }

   private parseDocument(code: string[], fullFileName: string): void {
     sourceCodeDocument.SetCode(code, Path.GetFileName(fullFileName));

     let currentIndent = 0;
     let nodePerIndent = new ParsableNodeArray(context.RootNode);

     while (sourceCodeDocument.HasMoreLines()) {
       if (!ProcessLine()) {
         currentIndent = sourceCodeDocument.CurrentLine?.Indent(logger) ?? currentIndent;
         continue;
       }

       let line = sourceCodeDocument.CurrentLine;
       if (line.IsEmpty()) continue;

       let indentResult = line.Indent(logger);
       if (!indentResult.HasValue) continue;

       let indent = indentResult.Value;
       if (indent > currentIndent) {
         context.Logger.Fail(line.LineStartReference(), $`Invalid indent: {indent}`);
         continue;
       }

       let node = nodePerIndent.Get(indent);
       node = ParseLine(node);

       currentIndent = indent + 1;

       nodePerIndent.Set(currentIndent, node);
     }

     Reset();

     LoadIncludedFiles(fullFileName);
   }

   private processLine(): boolean {
     let line = context.SourceCode.NextLine();
     logger.Log(line.LineStartReference(), $`'{line.Content}'`);

     let tokens = line.Tokenize(tokenizer);
     if (!tokens.IsSuccess) {
       logger.Fail(tokens.Reference, tokens.ErrorMessage);
       return false;
     }

     let tokenNames = string.Join(` `, context.CurrentLine.Tokens.Select(token =>
       $`{token.GetType().Name}({token.Value})`).ToArray());

     logger.Log(line.LineStartReference(), ` Tokens: ` + tokenNames);

     return tokens.IsSuccess;
   }

   private loadIncludedFiles(parentFullFileName: string): void {
     let includes = context.RootNode.GetDueIncludes();
     foreach (let include in includes) IncludeFiles(parentFullFileName, include);
   }

   private includeFiles(parentFullFileName: string, include: Include): void {
     let fileName = include.Process(parentFullFileName, context);
     if (fileName == null) return;

     if (context.IsFileIncluded(fileName)) return;

     logger.LogInfo(`Parse file: ` + fileName);

     let code = File.ReadAllLines(fileName);

     context.AddFileIncluded(fileName);

     ParseDocument(code, fileName);
   }

   private validateNodesTree(): void {
     let validationContext = new ValidationContext(logger, context.Nodes);
     context.RootNode.ValidateTree(validationContext);
   }

   private detectCircularDependencies(): void {
     let dependencies = DependencyGraphFactory.Create(context.Nodes);
     if (!dependencies.HasCircularReferences) return;

     foreach (let circularReference in dependencies.CircularReferences) {
       context.Logger.SetCurrentNode(circularReference);
       context.Logger.Fail(circularReference.Reference,
         $`Circular reference detected in: '{circularReference.NodeName}'`);
     }
   }

   private reset(): void {
     sourceCodeDocument.Reset();
     logger.Reset();
   }

   private parseLine(currentNode: IParsableNode): IParsableNode {
     let parseLineContext = new ParseLineContext(context.CurrentLine, context.Logger);
     let node = currentNode.Parse(parseLineContext);
     if (node == null) {
       throw new Error($`({currentNode}) Parse should return child node or itself.`);
     }

     if (node is IRootNode rootNode) {
       context.Logger.SetCurrentNode(rootNode);
     }

     return node;
   }
}
