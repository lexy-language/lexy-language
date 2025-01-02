

export class TodayFunction extends NoArgumentFunction {
   public readonly name: string = `TODAY`;

  public readonly nodeType = "TodayFunction";
  protected override get resultType(): VariableType => { return  PrimitiveType.date;

   constructor(reference: SourceReference)
     {
     super(reference);
   }

   public static create(reference: SourceReference): ExpressionFunction {
     return new TodayFunction(reference);
   }
}
