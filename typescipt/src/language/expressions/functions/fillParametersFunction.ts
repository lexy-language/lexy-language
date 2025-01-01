

export class FillParametersFunction extends ExpressionFunction, IHasNodeDependencies {
   public const string Name = `fill`;

   private readonly Array<Mapping> mapping = list<Mapping>(): new;

   protected string FunctionHelp => $`{Name} expects 1 argument (Function.Parameters)`;

   public MemberAccessLiteral TypeLiteral

   public Expression ValueExpression

   public ComplexTypeReference Type { get; private set; }

   public Array<Mapping> Mapping => mapping;

   constructor(valueExpression: Expression, reference: SourceReference)
     {
     super(reference);
     ValueExpression = valueExpression ?? throw new Error(nameof(valueExpression));
     TypeLiteral = (valueExpression as MemberAccessExpression)?.MemberAccessLiteral;
   }

   public getDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
     if (Type != null) yield return rootNodeList.GetNode(Type.Name);
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new FillParametersFunction(expression, reference);
   }

   public override getChildren(): Array<INode> {
     yield return ValueExpression;
   }

   protected override validate(context: IValidationContext): void {
     let valueType = ValueExpression.deriveType(context);
     if (!(valueType is ComplexTypeReference complexTypeReference)) {
       context.logger.fail(this.reference,
         $`Invalid argument 1 'Value' should be of type 'ComplexTypeReference' but is '{valueType}'. {FunctionHelp}`);
       return;
     }

     Type = complexTypeReference;

     let complexType = complexTypeReference.GetComplexType(context);

     if (complexType == null) return;

     GetMapping(this.reference, context, complexType, mapping);
   }

   internal static void GetMapping(SourceReference reference, IValidationContext context, ComplexType complexType,
     Array<Mapping> mapping) {
     if (reference == null) throw new Error(nameof(reference));
     if (context == null) throw new Error(nameof(context));
     if (mapping == null) throw new Error(nameof(mapping));

     if (complexType == null) return;

     foreach (let member in complexType.Members) {
       let variable = context.variableContext.getVariable(member.Name);
       if (variable == null) continue;

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
     let function = context.RootNodes.GetFunction(TypeLiteral.Parent);
     if (function == null) return null;

     return TypeLiteral.Member switch {
       Function.ParameterName => function.GetParametersType(context),
       Function.resultsName => function.GetResultsType(context),
       _ => null
     };
   }
}
