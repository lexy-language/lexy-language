

export class Function extends RootNode, IHasNodeDependencies {
   public const string ParameterName = `Parameters`;
   public const string ResultsName = `Results`;

   private static readonly LambdaComparer<IRootNode> NodeComparer =
     new((token1, token2) => token1.NodeName == token2.NodeName);

   public FunctionName Name
   public FunctionParameters Parameters
   public FunctionResults Results
   public FunctionCode Code

   public override string NodeName => Name.Value;

   private Function(string name, SourceReference reference) : base(reference) {
     Name = new FunctionName(reference);
     Parameters = new FunctionParameters(reference);
     Results = new FunctionResults(reference);
     Code = new FunctionCode(reference);

     Name.ParseName(name);
   }

   public getDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
     let result = new Array<IRootNode>();
     AddEnumTypes(rootNodeList, Parameters.Variables, result);
     AddEnumTypes(rootNodeList, Results.Variables, result);
     return result;
   }

   internal static create(name: string, reference: SourceReference): Function {
     return new Function(name, reference);
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let line = context.Line;
     let name = line.Tokens.TokenValue(0);
     if (!line.Tokens.IsTokenType<KeywordToken>(0)) return InvalidToken(name, context);

     return name switch {
       Keywords.Parameters => Parameters,
       Keywords.Results => Results,
       Keywords.Code => Code,
       _ => InvalidToken(name, context)
     };
   }

   private invalidToken(name: string, parserContext: IParseLineContext): IParsableNode {
     parserContext.Logger.Fail(Reference, $`Invalid token '{name}'.`);
     return this;
   }

   public getFunctionAndDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
     let result = new Array<IRootNode> { this };
     AddDependentNodes(this, rootNodeList, result);

     let processed = 0;
     while (processed != result.Count) {
       processed = result.Count;
       foreach (let node in result.ToList()) AddDependentNodes(node, rootNodeList, result);
     }

     return result;
   }

   private static addDependentNodes(node: INode, rootNodeList: RootNodeList, result: Array<IRootNode>): void {
     AddNodeDependencies(node, rootNodeList, result);

     let children = node.GetChildren();

     NodesWalker.Walk(children, eachNode => AddNodeDependencies(eachNode, rootNodeList, result));
   }

   private static addNodeDependencies(node: INode, rootNodeList: RootNodeList, result: Array<IRootNode>): void {
     if (!(node is IHasNodeDependencies hasDependencies)) return;

     let dependencies = hasDependencies.GetDependencies(rootNodeList);
     foreach (let dependency in dependencies)
       if (!result.Contains(dependency))
         result.Add(dependency);
   }

   private static void AddEnumTypes(RootNodeList rootNodeList, Array<VariableDefinition> variableDefinitions,
     Array<IRootNode> result) {
     foreach (let parameter in variableDefinitions) {
       if (!(parameter.Type is CustomVariableDeclarationType enumVariableType)) continue;

       let dependency = rootNodeList.GetEnum(enumVariableType.Type);
       if (dependency != null) result.Add(dependency);
     }
   }

   public override validateTree(context: IValidationContext): void {
     using (context.CreateVariableScope()) {
       base.ValidateTree(context);
     }
   }

   public override getChildren(): Array<INode> {
     yield return Name;

     yield return Parameters;
     yield return Results;

     yield return Code;
   }

   protected override validate(context: IValidationContext): void {
   }

   public getParametersType(context: IValidationContext): ComplexType {
     let members = Parameters.Variables
       .Select(parameter => new ComplexTypeMember(parameter.Name, parameter.Type.CreateVariableType(context)))
       .ToList();

     return new ComplexType(Name.Value, ComplexTypeSource.FunctionParameters, members);
   }

   public getResultsType(context: IValidationContext): ComplexType {
     let members = Results.Variables
       .Select(parameter => new ComplexTypeMember(parameter.Name, parameter.Type.CreateVariableType(context)))
       .ToList();

     return new ComplexType(Name.Value, ComplexTypeSource.FunctionResults, members);
   }
}
