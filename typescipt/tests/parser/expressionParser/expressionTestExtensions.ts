

export class ExpressionTestExtensions {
   public static validateOfType<T>(value: object, validate: Action<T>): void where T : class {
     if (value == null) throw new Error(nameof(value));

     let specificValue = value as T;
     if (specificValue == null)
       throw new Error(
         $`Value '{value.getType().Name}' should be of type '{typeof(T).Name}'`);

     validate(specificValue);
   }

   public static validateVariableExpression(expression: Expression, name: string): void {
     expression.ValidateOfType<IdentifierExpression>(left =>
       left.Identifier.ShouldBe(name));
   }

   public static validateNumericLiteralExpression(expression: Expression, value: decimal): void {
     expression.ValidateOfType<LiteralExpression>(literal => {
       literal.Literal.ValidateOfType<NumberLiteralToken>(number =>
         number.NumberValue.ShouldBe(value));
     });
   }

   public static validateQuotedLiteralExpression(expression: Expression, value: string): void {
     expression.ValidateOfType<LiteralExpression>(literal => {
       literal.Literal.ValidateOfType<QuotedLiteralToken>(number =>
         number.Value.ShouldBe(value));
     });
   }

   public static validateBooleanLiteralExpression(expression: Expression, value: boolean): void {
     expression.ValidateOfType<LiteralExpression>(literal => {
       literal.Literal.ValidateOfType<BooleanLiteral>(number =>
         number.BooleanValue.ShouldBe(value));
     });
   }

   public static validateDateTimeLiteralExpression(expression: Expression, value: DateTime): void {
     expression.ValidateOfType<LiteralExpression>(literal => {
       literal.Literal.ValidateOfType<DateTimeLiteral>(number =>
         number.DateTimeValue.ShouldBe(value));
     });
   }

   public static validateDateTimeLiteralExpression(expression: Expression, value: string): void {
     let valueDate = DateTime.parse(value);
     expression.ValidateOfType<LiteralExpression>(literal => {
       literal.Literal.ValidateOfType<DateTimeLiteral>(number =>
         number.DateTimeValue.ShouldBe(valueDate));
     });
   }

   public static validateIdentifierExpression(expression: Expression, value: string): void {
     expression.ValidateOfType<IdentifierExpression>(literal => { literal.Identifier.ShouldBe(value); });
   }

   public static validateMemberAccessExpression(expression: Expression, value: string): void {
     expression.ValidateOfType<MemberAccessExpression>(literal => { literal.Variable.toString().ShouldBe(value); });
   }
}
