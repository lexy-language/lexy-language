

export class SourceCodeNode extends RootNode {
   private readonly Array<Include> includes = list<Include>(): new;

   public override string NodeName => `SourceCodeNode`;

   public Comments Comments
   public RootNodeList RootNodes new(): =;

   public SourceCodeNode() : base(new SourceReference(new SourceFile(`SourceCodeNode`), 1, 1)) {
     Comments = new Comments(Reference);
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let line = context.Line;

     if (line.Tokens.IsComment()) return Comments;

     let rootNode = ParseRootNode(context);
     if (rootNode == null) return this;

     RootNodes.Add(rootNode);

     return rootNode;
   }

   private parseRootNode(context: IParseLineContext): IRootNode {
     if (Include.IsValid(context.Line)) {
       let include = Include.Parse(context);
       if (include != null) {
         includes.Add(include);
         return null;
       }
     }

     let tokenName = Parser.NodeName.Parse(context);
     if (tokenName == null) return null;

     let reference = context.Line.LineStartReference();
     let rootNode = tokenName.Keyword switch {
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

   private invalidNode(tokenName: NodeName, context: IParseLineContext, reference: SourceReference): IRootNode {
     context.Logger.Fail(reference, $`Unknown keyword: {tokenName.Keyword}`);
     return null;
   }

   public override getChildren(): Array<INode> {
     return RootNodes;
   }

   protected override validate(context: IValidationContext): void {
     DuplicateChecker.ValidateNode(
       context,
       node => node.Reference,
       node => node.NodeName,
       node => $`Duplicated node name: '{node.NodeName}'`,
       RootNodes);
   }

   public getDueIncludes(): Array<Include> {
     return includes.Where(include => !include.IsProcessed).ToList();
   }
}
