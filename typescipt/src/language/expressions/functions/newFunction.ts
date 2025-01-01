

export class NewFunction extends ExpressionFunction, IHasNodeDependencies {
   public const string Name = `new`;

   protected string FunctionHelp => $`{Name} expects 1 argument (Function.Parameters)`;

   public MemberAccessLiteral TypeLiteral

   public Expression ValueExpression

   public ComplexTypeReference Type { get; private set; }

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
     return new NewFunction(expression, reference);
   }

   public override getChildren(): Array<INode> {
     yield return ValueExpression;
   }

   protected override validate(context: IValidationContext): void {
     let valueType = ValueExpression.deriveType(context);
     if (!(valueType is ComplexTypeReference complexTypeReference)) {
       context.logger.fail(this.reference,
         $`Invalid argument 1 'Value' should be of type 'ComplexTypeType' but is 'ValueType'. {FunctionHelp}`);
       return;
     }

     Type = complexTypeReference;
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     let nodeType = context.RootNodes.GetType(TypeLiteral.Parent);
     let typeReference = nodeType?.MemberType(TypeLiteral.Member, context) as ComplexTypeReference;
     return typeReference?.GetComplexType(context);
   }
}
