

export class PowerFunction extends ExpressionFunction {
   public readonly name: string = `POWER`;

   private string functionHelp => $`'{Name} expects 2 arguments (Number, Power).`;

  public readonly nodeType = "PowerFunction";
  public Expression NumberExpression
   public Expression PowerExpression

   constructor(numberExpression: Expression, powerExpression: Expression, reference: SourceReference)
     {
     super(reference);
     NumberExpression = numberExpression;
     PowerExpression = powerExpression;
   }

   public override getChildren(): Array<INode> {
     yield return NumberExpression;
     yield return PowerExpression;
   }

   protected override validate(context: IValidationContext): void {
     context
       .validateType(NumberExpression, 1, `Number`, PrimitiveType.number, reference, functionHelp)
       .validateType(PowerExpression, 2, `Power`, PrimitiveType.number, reference, functionHelp);
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     return PrimitiveType.number;
   }

   public static ExpressionFunction Create(SourceReference reference, Expression numberExpression,
     Expression powerExpression) {
     return new PowerFunction(numberExpression, powerExpression, reference);
   }
}
