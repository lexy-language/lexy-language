

export class LexyCompiler extends ILexyCompiler {
   private readonly ILogger<LexyCompiler> logger;
   private readonly IExecutionEnvironment environment;

   constructor(logger: ILogger<LexyCompiler>, environment: IExecutionEnvironment) {
     this.logger = logger ?? throw new Error(nameof(logger));
     this.environment = environment ?? throw new Error(nameof(environment));
   }

   public compile(nodes: Array<IRootNode>): CompilerResult {
     if (nodes == null) throw new Error(nameof(nodes));

     try {
       let syntaxNode = GenerateSyntaxNode(nodes);
       let assembly = CreateAssembly(syntaxNode);

       environment.CreateExecutables(assembly);
       return environment.Result();
     }
     catch (Exception e) {
       logger.LogError(e, `Exception occured during compilation`);
       throw;
     }
   }

   private createAssembly(syntax: SyntaxNode): Assembly {
     let compilation = CreateSyntaxTree(syntax);

     string fullString = null;
     if (logger.IsEnabled(LogLevel.Debug)) {
       fullString = syntax.ToFullString();
       logger.LogDebug(fullString);
     }

     using let dllStream = new MemoryStream();
     using let pdbStream = new MemoryStream();

     let emitResult = compilation.Emit(dllStream, pdbStream);
     if (!emitResult.Success) CompilationFailed(fullString ?? syntax.ToFullString(), emitResult);

     return Assembly.Load(dllStream.ToArray());
   }

   private static createSyntaxTree(root: SyntaxNode): CSharpCompilation {
     let syntaxTree = SyntaxTree(root);
     let references = GetDllReferences();

     return CSharpCompilation.Create(
       $`{LexyCodeConstants.Namespace}.{Guid.NewGuid():D}`,
       new[] { syntaxTree },
       references,
       new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary));
   }

   private compilationFailed(code: string, emitResult: EmitResult): void {
     let compilationFailed = $`Compilation failed: {FormatCompilationErrors(emitResult.Diagnostics)}`;

     logger.LogError(compilationFailed);

     throw new Error($`{compilationFailed}{Environment.NewLine}code: {code}`);
   }

   private static getDllReferences(): Array<MetadataReference> {
     let references = new Array<MetadataReference> {
       MetadataReference.CreateFromFile(typeof(object).Assembly.Location),
       MetadataReference.CreateFromFile(typeof(FunctionResult).Assembly.Location)
     };

     Assembly.GetEntryAssembly().GetReferencedAssemblies()
       .ToList()
       .ForEach(reference =>
         references.Add(MetadataReference.CreateFromFile(Assembly.Load(reference).Location)));

     return references;
   }

   private generateSyntaxNode(generateNodes: Array<IRootNode>): SyntaxNode {
     let root = GenerateCompilationUnitS(generateNodes);

     return root.NormalizeWhitespace();
   }

   private generateCompilationUnitS(generateNodes: Array<IRootNode>): CompilationUnitSyntax {
     let members = generateNodes
       .Select(GenerateMember)
       .ToList();

     let namespaceDeclaration = NamespaceDeclaration(IdentifierName(LexyCodeConstants.Namespace))
       .WithMembers(List(members));

     let root = CompilationUnit()
       .WithUsings(List(
         new[] {
           Using(`System`),
           Using(`System.Collections.Generic`),
           Using(typeof(IExecutionContext).Namespace)
         }))
       .WithMembers(SingletonArray<MemberDeclarationSyntax>(namespaceDeclaration));
     return root;
   }

   private generateMember(node: IRootNode): MemberDeclarationSyntax {
     let writer = CSharpCode.GetWriter(node);

     let generatedType = writer.CreateCode(node);

     environment.AddType(generatedType);

     return generatedType.Syntax;
   }

   private static using(ns: string): UsingDirectiveSyntax {
     return UsingDirective(ParseName(ns));
   }

   private static formatCompilationErrors(emitResult: ImmutableArray<Diagnostic>): string {
     let stringWriter = new StringWriter();
     foreach (let diagnostic in emitResult) stringWriter.WriteLine($` {diagnostic}`);

     return stringWriter.ToString();
   }
}
