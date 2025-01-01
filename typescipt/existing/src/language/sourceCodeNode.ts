








namespace Lexy.Compiler.Language;

public class SourceCodeNode : RootNode
{
   private readonly IList<Include> includes = new List<Include>();

   public override string NodeName => "SourceCodeNode";

   public Comments Comments { get; }
   public RootNodeList RootNodes { get; } = new();

   public SourceCodeNode() : base(new SourceReference(new SourceFile("SourceCodeNode"), 1, 1))
   {
     Comments = new Comments(Reference);
   }

   public override IParsableNode Parse(IParseLineContext context)
   {
     var line = context.Line;

     if (line.Tokens.IsComment()) return Comments;

     var rootNode = ParseRootNode(context);
     if (rootNode = null) return this;

     RootNodes.Add(rootNode);

     return rootNode;
   }

   private IRootNode ParseRootNode(IParseLineContext context)
   {
     if (Include.IsValid(context.Line))
     {
       var include = Include.Parse(context);
       if (include ! null)
       {
         includes.Add(include);
         return null;
       }
     }

     var tokenName = Parser.NodeName.Parse(context);
     if (tokenName = null) return null;

     var reference = context.Line.LineStartReference();
     var rootNode = tokenName.Keyword switch
     {
       null => null,
       Keywords.FunctionKeyword => Function.Create(tokenName.Name, reference),
       Keywords.EnumKeyword => EnumDefinition.Parse(tokenName, reference),
       Keywords.ScenarioKeyword => Scenario.Parse(tokenName, reference),
       Keywords.TableKeyword => Table.Parse(tokenName, reference),
       Keywords.TypeKeyword => TypeDefinition.Parse(tokenName, reference),
       _ => InvalidNode(tokenName, context, reference)
     };

     return rootNode;
   }

   private IRootNode InvalidNode(NodeName tokenName, IParseLineContext context, SourceReference reference)
   {
     context.Logger.Fail(reference, $"Unknown keyword: {tokenName.Keyword}");
     return null;
   }

   public override IEnumerable<INode> GetChildren()
   {
     return RootNodes;
   }

   protected override void Validate(IValidationContext context)
   {
     DuplicateChecker.ValidateNode(
       context,
       node => node.Reference,
       node => node.NodeName,
       node => $"Duplicated node name: '{node.NodeName}'",
       RootNodes);
   }

   public IEnumerable<Include> GetDueIncludes()
   {
     return includes.Where(include => !include.IsProcessed).ToList();
   }
}
