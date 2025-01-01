

export class SecondFunction extends SingleArgumentFunction {
   public const string Name = `SECOND`;

   protected override string FunctionHelp => $`'{Name} expects 1 argument (Date)`;

   protected override VariableType ArgumentType => PrimitiveType.date;
   protected override VariableType ResultType => PrimitiveType.number;

   constructor(valueExpression: Expression, reference: SourceReference)
     : base(valueExpression, reference) {
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new SecondFunction(expression, reference);
   }
}
