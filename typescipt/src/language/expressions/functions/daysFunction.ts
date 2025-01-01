

export class DaysFunction extends EndStartDateFunction {
   public const string Name = `DAYS`;

   protected override string FunctionName => Name;

   constructor(endDateExpression: Expression, startDateExpression: Expression, reference: SourceReference)
     : base(endDateExpression, startDateExpression, reference) {
   }

   public static ExpressionFunction Create(SourceReference reference, Expression endDateExpression,
     Expression startDateExpression) {
     return new DaysFunction(endDateExpression, startDateExpression, reference);
   }
}
