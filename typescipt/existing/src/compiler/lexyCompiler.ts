















namespace Lexy.Compiler.Compiler;

public class LexyCompiler : ILexyCompiler
{
   private readonly ILogger<LexyCompiler> logger;
   private readonly IExecutionEnvironment environment;

   public LexyCompiler(ILogger<LexyCompiler> logger, IExecutionEnvironment environment)
   {
     this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
     this.environment = environment ?? throw new ArgumentNullException(nameof(environment));
   }

   public CompilerResult Compile(IEnumerable<IRootNode> nodes)
   {
     if (nodes = null) throw new ArgumentNullException(nameof(nodes));

     try
     {
       var syntaxNode = GenerateSyntaxNode(nodes);
       var assembly = CreateAssembly(syntaxNode);

       environment.CreateExecutables(assembly);
       return environment.Result();
     }
     catch (Exception e)
     {
       logger.LogError(e, "Exception occured during compilation");
       throw;
     }
   }

   private Assembly CreateAssembly(SyntaxNode syntax)
   {
     var compilation = CreateSyntaxTree(syntax);

     string fullString = null;
     if (logger.IsEnabled(LogLevel.Debug))
     {
       fullString = syntax.ToFullString();
       logger.LogDebug(fullString);
     }

     using var dllStream = new MemoryStream();
     using var pdbStream = new MemoryStream();

     var emitResult = compilation.Emit(dllStream, pdbStream);
     if (!emitResult.Success) CompilationFailed(fullString ?? syntax.ToFullString(), emitResult);

     return Assembly.Load(dllStream.ToArray());
   }

   private static CSharpCompilation CreateSyntaxTree(SyntaxNode root)
   {
     var syntaxTree = SyntaxTree(root);
     var references = GetDllReferences();

     return CSharpCompilation.Create(
       $"{LexyCodeConstants.Namespace}.{Guid.NewGuid():D}",
       new[] { syntaxTree },
       references,
       new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary));
   }

   private void CompilationFailed(string code, EmitResult emitResult)
   {
     var compilationFailed = $"Compilation failed: {FormatCompilationErrors(emitResult.Diagnostics)}";

     logger.LogError(compilationFailed);

     throw new InvalidOperationException($"{compilationFailed}{Environment.NewLine}code: {code}");
   }

   private static List<MetadataReference> GetDllReferences()
   {
     var references = new List<MetadataReference>
     {
       MetadataReference.CreateFromFile(typeof(object).Assembly.Location),
       MetadataReference.CreateFromFile(typeof(FunctionResult).Assembly.Location)
     };

     Assembly.GetEntryAssembly().GetReferencedAssemblies()
       .ToList()
       .ForEach(reference =>
         references.Add(MetadataReference.CreateFromFile(Assembly.Load(reference).Location)));

     return references;
   }

   private SyntaxNode GenerateSyntaxNode(IEnumerable<IRootNode> generateNodes)
   {
     var root = GenerateCompilationUnitS(generateNodes);

     return root.NormalizeWhitespace();
   }

   private CompilationUnitSyntax GenerateCompilationUnitS(IEnumerable<IRootNode> generateNodes)
   {
     var members = generateNodes
       .Select(GenerateMember)
       .ToList();

     var namespaceDeclaration = NamespaceDeclaration(IdentifierName(LexyCodeConstants.Namespace))
       .WithMembers(List(members));

     var root = CompilationUnit()
       .WithUsings(List(
         new[]
         {
           Using("System"),
           Using("System.Collections.Generic"),
           Using(typeof(IExecutionContext).Namespace)
         }))
       .WithMembers(SingletonList<MemberDeclarationSyntax>(namespaceDeclaration));
     return root;
   }

   private MemberDeclarationSyntax GenerateMember(IRootNode node)
   {
     var writer = CSharpCode.GetWriter(node);

     var generatedType = writer.CreateCode(node);

     environment.AddType(generatedType);

     return generatedType.Syntax;
   }

   private static UsingDirectiveSyntax Using(string ns)
   {
     return UsingDirective(ParseName(ns));
   }

   private static string FormatCompilationErrors(ImmutableArray<Diagnostic> emitResult)
   {
     var stringWriter = new StringWriter();
     foreach (var diagnostic in emitResult) stringWriter.WriteLine($" {diagnostic}");

     return stringWriter.ToString();
   }
}
