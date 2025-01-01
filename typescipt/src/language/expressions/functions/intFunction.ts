

export class IntFunction extends SingleArgumentFunction {
   public const string Name = `INT`;

   protected override string FunctionHelp => $`{Name} expects 1 argument (Value)`;

   protected override VariableType ArgumentType => PrimitiveType.number;
   protected override VariableType ResultType => PrimitiveType.number;

   constructor(valueExpression: Expression, reference: SourceReference)
     : base(valueExpression, reference) {
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new IntFunction(expression, reference);
   }
}
