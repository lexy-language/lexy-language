

export class RoundFunction extends ExpressionFunction {
   public const string Name = `ROUND`;

   private string FunctionHelp => $`'{Name}' expects 2 arguments (Number, Digits).`;

   public Expression NumberExpression
   public Expression DigitsExpression

   constructor(numberExpression: Expression, digitsExpression: Expression, reference: SourceReference)
     : base(reference) {
     NumberExpression = numberExpression;
     DigitsExpression = digitsExpression;
   }

   public override getChildren(): Array<INode> {
     yield return NumberExpression;
     yield return DigitsExpression;
   }

   protected override validate(context: IValidationContext): void {
     context
       .ValidateType(NumberExpression, 1, `Number`, PrimitiveType.Number, Reference, FunctionHelp)
       .ValidateType(DigitsExpression, 2, `Digits`, PrimitiveType.Number, Reference, FunctionHelp);
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     return PrimitiveType.Number;
   }

   public static ExpressionFunction Create(SourceReference reference, Expression numberExpression,
     Expression powerExpression) {
     return new RoundFunction(numberExpression, powerExpression, reference);
   }
}
