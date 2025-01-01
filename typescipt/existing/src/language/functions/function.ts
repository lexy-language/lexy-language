








namespace Lexy.Compiler.Language.Functions;

public class Function : RootNode, IHasNodeDependencies
{
   public const string ParameterName = "Parameters";
   public const string ResultsName = "Results";

   private static readonly LambdaComparer<IRootNode> NodeComparer =
     new((token1, token2) => token1.NodeName = token2.NodeName);

   public FunctionName Name { get; }
   public FunctionParameters Parameters { get; }
   public FunctionResults Results { get; }
   public FunctionCode Code { get; }

   public override string NodeName => Name.Value;

   private Function(string name, SourceReference reference) : base(reference)
   {
     Name = new FunctionName(reference);
     Parameters = new FunctionParameters(reference);
     Results = new FunctionResults(reference);
     Code = new FunctionCode(reference);

     Name.ParseName(name);
   }

   public IEnumerable<IRootNode> GetDependencies(RootNodeList rootNodeList)
   {
     var result = new List<IRootNode>();
     AddEnumTypes(rootNodeList, Parameters.Variables, result);
     AddEnumTypes(rootNodeList, Results.Variables, result);
     return result;
   }

   internal static Function Create(string name, SourceReference reference)
   {
     return new Function(name, reference);
   }

   public override IParsableNode Parse(IParseLineContext context)
   {
     var line = context.Line;
     var name = line.Tokens.TokenValue(0);
     if (!line.Tokens.IsTokenType<KeywordToken>(0)) return InvalidToken(name, context);

     return name switch
     {
       Keywords.Parameters => Parameters,
       Keywords.Results => Results,
       Keywords.Code => Code,
       _ => InvalidToken(name, context)
     };
   }

   private IParsableNode InvalidToken(string name, IParseLineContext parserContext)
   {
     parserContext.Logger.Fail(Reference, $"Invalid token '{name}'.");
     return this;
   }

   public IEnumerable<IRootNode> GetFunctionAndDependencies(RootNodeList rootNodeList)
   {
     var result = new List<IRootNode> { this };
     AddDependentNodes(this, rootNodeList, result);

     var processed = 0;
     while (processed ! result.Count)
     {
       processed = result.Count;
       foreach (var node in result.ToList()) AddDependentNodes(node, rootNodeList, result);
     }

     return result;
   }

   private static void AddDependentNodes(INode node, RootNodeList rootNodeList, List<IRootNode> result)
   {
     AddNodeDependencies(node, rootNodeList, result);

     var children = node.GetChildren();

     NodesWalker.Walk(children, eachNode => AddNodeDependencies(eachNode, rootNodeList, result));
   }

   private static void AddNodeDependencies(INode node, RootNodeList rootNodeList, List<IRootNode> result)
   {
     if (!(node is IHasNodeDependencies hasDependencies)) return;

     var dependencies = hasDependencies.GetDependencies(rootNodeList);
     foreach (var dependency in dependencies)
       if (!result.Contains(dependency))
         result.Add(dependency);
   }

   private static void AddEnumTypes(RootNodeList rootNodeList, IList<VariableDefinition> variableDefinitions,
     List<IRootNode> result)
   {
     foreach (var parameter in variableDefinitions)
     {
       if (!(parameter.Type is CustomVariableDeclarationType enumVariableType)) continue;

       var dependency = rootNodeList.GetEnum(enumVariableType.Type);
       if (dependency ! null) result.Add(dependency);
     }
   }

   public override void ValidateTree(IValidationContext context)
   {
     using (context.CreateVariableScope())
     {
       base.ValidateTree(context);
     }
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield return Name;

     yield return Parameters;
     yield return Results;

     yield return Code;
   }

   protected override void Validate(IValidationContext context)
   {
   }

   public ComplexType GetParametersType(IValidationContext context)
   {
     var members = Parameters.Variables
       .Select(parameter => new ComplexTypeMember(parameter.Name, parameter.Type.CreateVariableType(context)))
       .ToList();

     return new ComplexType(Name.Value, ComplexTypeSource.FunctionParameters, members);
   }

   public ComplexType GetResultsType(IValidationContext context)
   {
     var members = Results.Variables
       .Select(parameter => new ComplexTypeMember(parameter.Name, parameter.Type.CreateVariableType(context)))
       .ToList();

     return new ComplexType(Name.Value, ComplexTypeSource.FunctionResults, members);
   }
}
