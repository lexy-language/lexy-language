

export class MonthsFunction extends EndStartDateFunction {
   public const string Name = `MONTHS`;

   protected override string FunctionName => Name;

   constructor(endDateExpression: Expression, startDateExpression: Expression, reference: SourceReference)
     : base(endDateExpression, startDateExpression, reference) {
   }

   public static ExpressionFunction Create(SourceReference reference, Expression endDateExpression,
     Expression startDateExpression) {
     return new MonthsFunction(endDateExpression, startDateExpression, reference);
   }
}
