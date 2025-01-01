

export class ConstantValue {
   public object Value

   constructor(value: object) {
     Value = value;
   }

   public static parse(expression: Expression): ConstantValueParseResult {
     return expression switch {
       LiteralExpression literalExpression => Parse(literalExpression),
       MemberAccessExpression literalExpression => Parse(literalExpression),
       _ => ConstantValueParseResult.failed(`Invalid expression variable. Expected: 'Variable = ConstantValue'`)
     };
   }

   private static parse(literalExpression: LiteralExpression): ConstantValueParseResult {
     let value = new ConstantValue(literalExpression.Literal.TypedValue);
     return ConstantValueParseResult.Success(value);
   }

   private static parse(literalExpression: MemberAccessExpression): ConstantValueParseResult {
     return ConstantValueParseResult.Success(new ConstantValue(literalExpression.MemberAccessLiteral.Value));
   }
}
