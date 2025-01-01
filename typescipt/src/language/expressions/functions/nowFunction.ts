

export class NowFunction extends NoArgumentFunction {
   public const string Name = `NOW`;

   protected override VariableType ResultType => PrimitiveType.Date;

   constructor(reference: SourceReference)
     : base(reference) {
   }

   public static create(reference: SourceReference): ExpressionFunction {
     return new NowFunction(reference);
   }
}
