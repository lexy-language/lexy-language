

export class HoursFunction extends EndStartDateFunction {
   public const string Name = `HOURS`;

   protected override string FunctionName => Name;

   constructor(endDateExpression: Expression, startDateExpression: Expression, reference: SourceReference)
     : base(endDateExpression, startDateExpression, reference) {
   }

   public static ExpressionFunction Create(SourceReference reference, Expression endDateExpression,
     Expression startDateExpression) {
     return new HoursFunction(endDateExpression, startDateExpression, reference);
   }
}
