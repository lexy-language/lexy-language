

export class RoundFunction extends ExpressionFunction {
   public readonly name: string = `ROUND`;

   private string functionHelp => $`'{Name}' expects 2 arguments (Number, Digits).`;

  public readonly nodeType = "RoundFunction";
  public Expression NumberExpression
   public Expression DigitsExpression

   constructor(numberExpression: Expression, digitsExpression: Expression, reference: SourceReference)
     {
     super(reference);
     NumberExpression = numberExpression;
     DigitsExpression = digitsExpression;
   }

   public override getChildren(): Array<INode> {
     yield return NumberExpression;
     yield return DigitsExpression;
   }

   protected override validate(context: IValidationContext): void {
     context
       .validateType(NumberExpression, 1, `Number`, PrimitiveType.number, reference, functionHelp)
       .validateType(DigitsExpression, 2, `Digits`, PrimitiveType.number, reference, functionHelp);
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     return PrimitiveType.number;
   }

   public static ExpressionFunction Create(SourceReference reference, Expression numberExpression,
     Expression powerExpression) {
     return new RoundFunction(numberExpression, powerExpression, reference);
   }
}
