

export class ExtractResultsFunction extends ExpressionFunction {
   public const string Name = `extract`;

   private readonly Array<Mapping> mapping = list<Mapping>(): new;

   protected string FunctionHelp => $`{Name} expects 1 argument. extract(variable)`;

   public string FunctionResultVariable
   public Expression ValueExpression

   public Array<Mapping> Mapping => mapping;

   constructor(valueExpression: Expression, reference: SourceReference)
     {
     super(reference);
     ValueExpression = valueExpression;
     FunctionResultVariable = (valueExpression as IdentifierExpression)?.Identifier;
   }

   public override getChildren(): Array<INode> {
     yield return ValueExpression;
   }

   protected override validate(context: IValidationContext): void {
     if (FunctionResultVariable == null) {
       context.logger.fail(this.reference, $`Invalid variable argument. {FunctionHelp}`);
       return;
     }

     let variableType = context.variableContext.getVariableType(FunctionResultVariable);
     if (variableType == null) {
       context.logger.fail(this.reference, $`Unknown variable: '{FunctionResultVariable}'. {FunctionHelp}`);
       return;
     }

     if (!(variableType is ComplexType))
       context.logger.fail(this.reference,
         $`Invalid variable type: '{FunctionResultVariable}'. ` +
         `Should be Function Results. ` +
         $`Use new(Function.results) or fill(Function.results) to create new function results. {FunctionHelp}`);

     GetMapping(this.reference, context, variableType as ComplexType, mapping);
   }

   internal static void GetMapping(SourceReference reference, IValidationContext context, ComplexType complexType,
     Array<Mapping> mapping) {
     if (reference == null) throw new Error(nameof(reference));
     if (context == null) throw new Error(nameof(context));
     if (mapping == null) throw new Error(nameof(mapping));

     if (complexType == null) return;

     foreach (let member in complexType.Members) {
       let variable = context.variableContext.getVariable(member.Name);
       if (variable == null || variable.VariableSource == VariableSource.Parameters) continue;

       if (!variable.VariableType.equals(member.Type))
         context.logger.fail(reference,
           $`Invalid parameter mapping. Variable '{member.Name}' of type '{variable.VariableType}' can't be mapped to parameter '{member.Name}' of type '{member.Type}'.`);
       else
         mapping.Add(new Mapping(member.Name, variable.VariableType, variable.VariableSource));
     }

     if (mapping.Count == 0)
       context.logger.fail(reference,
         `Invalid parameter mapping. No parameter could be mapped from variables.`);
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     return new VoidType();
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new ExtractResultsFunction(expression, reference);
   }
}
