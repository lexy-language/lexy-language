

export class NewFunction extends ExpressionFunction, IHasNodeDependencies {
   public readonly name: string = `new`;

  public readonly nodeType = "NewFunction";
  protected string functionHelp => $`{Name} expects 1 argument (Function.Parameters)`;

   public MemberAccessLiteral TypeLiteral

   public Expression valueExpression

   public ComplexTypeReference Type { get; private set; }

   constructor(valueExpression: Expression, reference: SourceReference)
     {
     super(reference);
     valueExpression = valueExpression ?? throw new Error(nameof(valueExpression));
     TypeLiteral = (valueExpression as MemberAccessExpression)?.MemberAccessLiteral;
   }

   public getDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
     if (Type != null) yield return rootNodeList.getNode(Type.Name);
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new NewFunction(expression, reference);
   }

   public override getChildren(): Array<INode> {
     yield return valueExpression;
   }

   protected override validate(context: IValidationContext): void {
     let valueType = valueExpression.deriveType(context);
     if (!(valueType is ComplexTypeReference complexTypeReference)) {
       context.logger.fail(this.reference,
         $`Invalid argument 1 'Value' should be of type 'ComplexTypeType' but is 'ValueType'. {functionHelp}`);
       return;
     }

     Type = complexTypeReference;
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     let nodeType = context.rootNodes.getType(TypeLiteral.Parent);
     let typeReference = nodeType?.MemberType(TypeLiteral.Member, context) as ComplexTypeReference;
     return typeReference?.GetComplexType(context);
   }
}
