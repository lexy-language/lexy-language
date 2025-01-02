

export class MinutesFunction extends EndStartDateFunction {
   public readonly name: string = `MINUTES`;

   public readonly nodeType = "MinutesFunction";
   protected override get functionName(): string { return Name;

   constructor(endDateExpression: Expression, startDateExpression: Expression, reference: SourceReference)
     super(endDateExpression, startDateExpression, reference) {
   }

   public static ExpressionFunction Create(SourceReference reference, Expression endDateExpression,
     Expression startDateExpression) {
     return new MinutesFunction(endDateExpression, startDateExpression, reference);
   }
}
