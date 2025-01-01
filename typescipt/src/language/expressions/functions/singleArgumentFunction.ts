

export class SingleArgumentFunction extends ExpressionFunction {
   protected abstract string FunctionHelp

   protected abstract VariableType ArgumentType
   protected abstract VariableType ResultType

   public Expression ValueExpression

   constructor(valueExpression: Expression, reference: SourceReference)
     : base(reference) {
     ValueExpression = valueExpression ?? throw new Error(nameof(valueExpression));
   }

   public override getChildren(): Array<INode> {
     yield return ValueExpression;
   }

   protected override validate(context: IValidationContext): void {
     context.ValidateType(ValueExpression, 1, `Value`, ArgumentType, Reference, FunctionHelp);
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     return ResultType;
   }
}
