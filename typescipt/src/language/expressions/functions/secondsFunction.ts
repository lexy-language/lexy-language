

export class SecondsFunction extends EndStartDateFunction {
   public readonly name: string = `SECONDS`;

   public readonly nodeType = "SecondsFunction";
   protected override get functionName(): string { return Name;

   constructor(endDateExpression: Expression, startDateExpression: Expression, reference: SourceReference)
     super(endDateExpression, startDateExpression, reference) {
   }

   public static ExpressionFunction Create(SourceReference reference, Expression endDateExpression,
     Expression startDateExpression) {
     return new SecondsFunction(endDateExpression, startDateExpression, reference);
   }
}
