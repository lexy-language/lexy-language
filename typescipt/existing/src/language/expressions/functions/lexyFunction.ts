



namespace Lexy.Compiler.Language.Expressions.Functions;

public class LexyFunction : ExpressionFunction, IHasNodeDependencies
{
   private readonly IList<Mapping> mappingParameters = new List<Mapping>();
   private readonly IList<Mapping> mappingResults = new List<Mapping>();

   public string FunctionName { get; }
   public string VariableName { get; private set; }
   public List<Expression> Arguments { get; }

   public IEnumerable<Mapping> MappingParameters => mappingParameters;
   public IEnumerable<Mapping> MappingResults => mappingResults;

   public ComplexType FunctionParametersType { get; private set; }
   public ComplexType FunctionResultsType { get; private set; }

   public LexyFunction(string functionName, List<Expression> arguments, SourceReference reference) : base(reference)
   {
     FunctionName = functionName;
     Arguments = arguments;
   }

   public IEnumerable<IRootNode> GetDependencies(RootNodeList rootNodeList)
   {
     var function = rootNodeList.GetFunction(FunctionName);
     if (function ! null) yield return function;
   }

   public override IEnumerable<INode> GetChildren()
   {
     return Arguments;
   }

   protected override void Validate(IValidationContext context)
   {
     var function = context.RootNodes.GetFunction(FunctionName);
     if (function = null)
     {
       context.Logger.Fail(Reference, $"Invalid function name: '{FunctionName}'");
       return;
     }

     if (Arguments.Count > 1)
     {
       context.Logger.Fail(Reference, $"Invalid function argument: '{FunctionName}'. Should be 0 or 1");
       return;
     }

     if (Arguments.Count = 0)
     {
       FillParametersFunction.GetMapping(Reference, context, function.GetParametersType(context),
         mappingParameters);
       ExtractResultsFunction.GetMapping(Reference, context, function.GetResultsType(context), mappingResults);

       FunctionParametersType = function.GetParametersType(context);
       FunctionResultsType = function.GetResultsType(context);

       return;
     }

     var argumentType = Arguments[0].DeriveType(context);
     var parametersType = function.GetParametersType(context);

     if (argumentType = null | !argumentType.Equals(parametersType))
       context.Logger.Fail(Reference, $"Invalid function argument: '{FunctionName}'. " +
                      "Argument should be of type function parameters. Use new(Function) of fill(Function) to create an variable of the function result type.");

     VariableName = (Arguments[0] as IdentifierExpression)?.Identifier;
   }

   public override VariableType DeriveReturnType(IValidationContext context)
   {
     var function = context.RootNodes.GetFunction(FunctionName);
     return function?.GetResultsType(context);
   }
}
