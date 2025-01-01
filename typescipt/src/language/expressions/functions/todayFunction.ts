

export class TodayFunction extends NoArgumentFunction {
   public const string Name = `TODAY`;

   protected override VariableType ResultType => PrimitiveType.Date;

   constructor(reference: SourceReference)
     : base(reference) {
   }

   public static create(reference: SourceReference): ExpressionFunction {
     return new TodayFunction(reference);
   }
}
