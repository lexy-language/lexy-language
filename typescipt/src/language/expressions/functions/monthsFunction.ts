

export class MonthsFunction extends EndStartDateFunction {
   public readonly name: string = `MONTHS`;

   public readonly nodeType = "MonthsFunction";
   protected override get functionName(): string { return Name;

   constructor(endDateExpression: Expression, startDateExpression: Expression, reference: SourceReference)
     super(endDateExpression, startDateExpression, reference) {
   }

   public static ExpressionFunction Create(SourceReference reference, Expression endDateExpression,
     Expression startDateExpression) {
     return new MonthsFunction(endDateExpression, startDateExpression, reference);
   }
}
