

export class YearsFunction extends EndStartDateFunction {
   public readonly name: string = `YEARS`;

   public readonly nodeType = "YearsFunction";
   protected override get functionName(): string { return Name;

   constructor(endDateExpression: Expression, startDateExpression: Expression, reference: SourceReference)
     super(endDateExpression, startDateExpression, reference) {
   }

   public static ExpressionFunction Create(SourceReference reference, Expression endDateExpression,
     Expression startDateExpression) {
     return new YearsFunction(endDateExpression, startDateExpression, reference);
   }
}
