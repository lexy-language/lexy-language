

export class NowFunction extends NoArgumentFunction {
   public const string Name = `NOW`;

   protected override VariableType ResultType => PrimitiveType.date;

   constructor(reference: SourceReference)
     {
     super(reference);
   }

   public static create(reference: SourceReference): ExpressionFunction {
     return new NowFunction(reference);
   }
}
