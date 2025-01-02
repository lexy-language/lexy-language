

export class YearsFunction extends SingleArgumentFunction {
   public readonly name: string = `YEAR`;

   public readonly nodeType = "YearsFunction";
   protected override get functionHelp(): string { return $`'{Name} expects 1 argument (Date)`;

   protected override get argumentType(): VariableType { PrimitiveType.date;
   protected override get resultType(): VariableType => { return  PrimitiveType.number;

   constructor(valueExpression: Expression, reference: SourceReference)
     super(valueExpression, reference);
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new YearFunction(expression, reference);
   }
}
