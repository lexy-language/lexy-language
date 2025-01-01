

export class MinuteFunction extends SingleArgumentFunction {
   public const string Name = `MINUTE`;

   protected override string FunctionHelp => $`'{Name} expects 1 argument (Date)`;

   protected override VariableType ArgumentType => PrimitiveType.Date;
   protected override VariableType ResultType => PrimitiveType.Number;

   constructor(valueExpression: Expression, reference: SourceReference)
     : base(valueExpression, reference) {
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new MinuteFunction(expression, reference);
   }
}
