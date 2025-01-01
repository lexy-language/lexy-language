

export class LexyFunction extends ExpressionFunction, IHasNodeDependencies {
   private readonly Array<Mapping> mappingParameters = list<Mapping>(): new;
   private readonly Array<Mapping> mappingResults = list<Mapping>(): new;

   public string FunctionName
   public string VariableName { get; private set; }
   public Array<Expression> Arguments

   public Array<Mapping> MappingParameters => mappingParameters;
   public Array<Mapping> MappingResults => mappingResults;

   public ComplexType FunctionParametersType { get; private set; }
   public ComplexType FunctionResultsType { get; private set; }

   public LexyFunction(string functionName, Array<Expression> arguments, SourceReference reference) {
     super(reference);
     FunctionName = functionName;
     Arguments = arguments;
   }

   public getDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
     let function = rootNodeList.GetFunction(FunctionName);
     if (function != null) yield return function;
   }

   public override getChildren(): Array<INode> {
     return Arguments;
   }

   protected override validate(context: IValidationContext): void {
     let function = context.RootNodes.GetFunction(FunctionName);
     if (function == null) {
       context.logger.fail(this.reference, $`Invalid function name: '{FunctionName}'`);
       return;
     }

     if (Arguments.Count > 1) {
       context.logger.fail(this.reference, $`Invalid function argument: '{FunctionName}'. Should be 0 or 1`);
       return;
     }

     if (Arguments.Count == 0) {
       FillParametersFunction.GetMapping(this.reference, context, function.GetParametersType(context),
         mappingParameters);
       ExtractResultsFunction.GetMapping(this.reference, context, function.GetResultsType(context), mappingResults);

       FunctionParametersType = function.GetParametersType(context);
       FunctionResultsType = function.GetResultsType(context);

       return;
     }

     let argumentType = Arguments[0].deriveType(context);
     let parametersType = function.GetParametersType(context);

     if (argumentType == null || !argumentType.equals(parametersType))
       context.logger.fail(this.reference, $`Invalid function argument: '{FunctionName}'. ` +
                      `Argument should be of type function parameters. Use new(Function) of fill(Function) to create an variable of the function result type.`);

     VariableName = (Arguments[0] as IdentifierExpression)?.Identifier;
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     let function = context.RootNodes.GetFunction(FunctionName);
     return function?.GetResultsType(context);
   }
}
