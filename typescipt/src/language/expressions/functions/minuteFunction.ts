

export class MinuteFunction extends SingleArgumentFunction {
   public readonly name: string = `MINUTE`;

   public readonly nodeType = "MinuteFunction";
   protected override get functionHelp(): string { return $`'{Name} expects 1 argument (Date)`;

   protected override get argumentType(): VariableType { PrimitiveType.date;
   protected override get resultType(): VariableType => { return  PrimitiveType.number;

   constructor(valueExpression: Expression, reference: SourceReference)
     super(valueExpression, reference);
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new MinuteFunction(expression, reference);
   }
}
