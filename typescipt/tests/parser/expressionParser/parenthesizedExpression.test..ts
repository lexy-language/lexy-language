

export class ParenthesizedExpressionTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public parenthesizedExpression(): void {
     let expression = this.ParseExpression(`(A)`);
     expression.ValidateOfType<ParenthesizedExpression>(parenthesized =>
       parenthesized.Expression.ValidateVariableExpression(`A`));
   }

  it('XXXX', async () => {
   public nestedParenthesizedExpression(): void {
     let expression = this.ParseExpression(`(5 * (3 + A))`);
     expression.ValidateOfType<ParenthesizedExpression>(parenthesis =>
       parenthesis.Expression.ValidateOfType<BinaryExpression>(multiplication =>
         multiplication.Right.ValidateOfType<ParenthesizedExpression>(inner =>
           inner.Expression.ValidateOfType<BinaryExpression>(addition =>
             addition.Operator.ShouldBe(ExpressionOperator.Addition)))));
   }

  it('XXXX', async () => {
   public invalidParenthesizedExpression(): void {
     this.ParseExpressionExpectException(
       `(A`,
       `(ParenthesizedExpression) No closing parentheses found.`);
   }

  it('XXXX', async () => {
   public invalidNestedParenthesizedExpression(): void {
     this.ParseExpressionExpectException(
       `(5 * (3 + A)`,
       `(ParenthesizedExpression) No closing parentheses found.`);
   }
}
