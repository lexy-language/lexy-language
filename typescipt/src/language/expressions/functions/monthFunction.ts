

export class MonthFunction extends SingleArgumentFunction {
   public readonly name: string = `MONTH`;

   public readonly nodeType = "MonthFunction";
   protected override get functionHelp(): string { return $`'{Name} expects 1 argument (Date)`;

   protected override get argumentType(): VariableType { PrimitiveType.date;
   protected override get resultType(): VariableType => { return  PrimitiveType.number;

   constructor(valueExpression: Expression, reference: SourceReference)
     super(valueExpression, reference);
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new MonthFunction(expression, reference);
   }
}
