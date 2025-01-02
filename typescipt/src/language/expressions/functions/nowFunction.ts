

export class NowFunction extends NoArgumentFunction {
   public readonly name: string = `NOW`;

  public readonly nodeType = "NowFunction";
  protected override get resultType(): VariableType => { return  PrimitiveType.date;

   constructor(reference: SourceReference)
     {
     super(reference);
   }

   public static create(reference: SourceReference): ExpressionFunction {
     return new NowFunction(reference);
   }
}
