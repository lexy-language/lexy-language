

export class SecondFunction extends SingleArgumentFunction {
   public readonly name: string = `SECOND`;

   protected override get functionHelp(): string { return $`'{Name} expects 1 argument (Date)`;

   public readonly nodeType = "SecondFunction";
   protected override get argumentType(): VariableType { PrimitiveType.date;
   protected override get resultType(): VariableType => { return  PrimitiveType.number;

   constructor(valueExpression: Expression, reference: SourceReference)
     super(valueExpression, reference);
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new SecondFunction(expression, reference);
   }
}
