

export class TodayFunction extends NoArgumentFunction {
   public const string Name = `TODAY`;

   protected override VariableType ResultType => PrimitiveType.date;

   constructor(reference: SourceReference)
     {
     super(reference);
   }

   public static create(reference: SourceReference): ExpressionFunction {
     return new TodayFunction(reference);
   }
}
