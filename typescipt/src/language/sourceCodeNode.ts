

export class SourceCodeNode extends RootNode {
   private readonly Array<Include> includes = list<Include>(): new;

   public override string NodeName => `SourceCodeNode`;

   public Comments Comments
   public RootNodeList rootNodes new(): =;

   public SourceCodeNode() super(new SourceReference(new SourceFile(`SourceCodeNode`), 1, 1)) {
     Comments = new Comments(reference);
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let line = context.line;

     if (line.tokens.IsComment()) return Comments;

     let rootNode = ParseRootNode(context);
     if (rootNode == null) return this;

     rootNodes.Add(rootNode);

     return rootNode;
   }

   private parseRootNode(context: IParseLineContext): IRootNode {
     if (Include.isValid(context.line)) {
       let include = Include.parse(context);
       if (include != null) {
         includes.Add(include);
         return null;
       }
     }

     let tokenName = Parser.NodeName.parse(context);
     if (tokenName == null) return null;

     let reference = context.line.lineStartReference();
     let rootNode = tokenName.Keyword switch {
       null => null,
       Keywords.FunctionKeyword => Function.Create(tokenName.Name, reference),
       Keywords.EnumKeyword => EnumDefinition.parse(tokenName, reference),
       Keywords.ScenarioKeyword => Scenario.parse(tokenName, reference),
       Keywords.TableKeyword => Table.parse(tokenName, reference),
       Keywords.TypeKeyword => TypeDefinition.parse(tokenName, reference),
       _ => InvalidNode(tokenName, context, reference)
     };

     return rootNode;
   }

   private invalidNode(tokenName: NodeName, context: IParseLineContext, reference: SourceReference): IRootNode {
     context.logger.fail(reference, $`Unknown keyword: {tokenName.Keyword}`);
     return null;
   }

   public override getChildren(): Array<INode> {
     return rootNodes;
   }

   protected override validate(context: IValidationContext): void {
     DuplicateChecker.ValidateNode(
       context,
       node => node.reference,
       node => node.NodeName,
       node => $`Duplicated node name: '{node.NodeName}'`,
       rootNodes);
   }

   public getDueIncludes(): Array<Include> {
     return includes.Where(include => !include.IsProcessed).ToList();
   }
}
