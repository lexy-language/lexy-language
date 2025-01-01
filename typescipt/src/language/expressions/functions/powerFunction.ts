

export class PowerFunction extends ExpressionFunction {
   public const string Name = `POWER`;

   private string FunctionHelp => $`'{Name} expects 2 arguments (Number, Power).`;

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
       .ValidateType(NumberExpression, 1, `Number`, PrimitiveType.number, reference, FunctionHelp)
       .ValidateType(PowerExpression, 2, `Power`, PrimitiveType.number, reference, FunctionHelp);
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     return PrimitiveType.number;
   }

   public static ExpressionFunction Create(SourceReference reference, Expression numberExpression,
     Expression powerExpression) {
     return new PowerFunction(numberExpression, powerExpression, reference);
   }
}
