

export class AbsFunction extends SingleArgumentFunction {
   public const string Name = `ABS`;

   protected override string FunctionHelp => $`{Name} expects 1 argument (Value)`;

   protected override VariableType ArgumentType => PrimitiveType.Number;
   protected override VariableType ResultType => PrimitiveType.Number;

   constructor(valueExpression: Expression, reference: SourceReference)
     : base(valueExpression, reference) {
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new AbsFunction(expression, reference);
   }
}
