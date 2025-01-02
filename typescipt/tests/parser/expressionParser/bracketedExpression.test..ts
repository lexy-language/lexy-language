

export class BracketedExpressionTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public functionCallExpression(): void {
     let expression = this.ParseExpression(`func[y]`);
     expression.ValidateOfType<BracketedExpression>(functionCallExpression => {
       functionCallExpression.functionName.ShouldBe(`func`);
       functionCallExpression.Expression.ValidateVariableExpression(`y`);
     });
   }

  it('XXXX', async () => {
   public nestedParenthesizedExpression(): void {
     let expression = this.ParseExpression(`func[5 * (3 + A)]`);
     expression.ValidateOfType<BracketedExpression>(functionCall => {
       functionCall.functionName.ShouldBe(`func`);
       functionCall.Expression.ValidateOfType<BinaryExpression>(multiplication => {
         multiplication.Operator.ShouldBe(ExpressionOperator.Multiplication);
         multiplication.Right.ValidateOfType<ParenthesizedExpression>(inner =>
           inner.Expression.ValidateOfType<BinaryExpression>(addition =>
             addition.Operator.ShouldBe(ExpressionOperator.Addition)));
       });
     });
   }

  it('XXXX', async () => {
   public invalidParenthesizedExpression(): void {
     this.ParseExpressionExpectException(
       `func[A`,
       `(BracketedExpression) No closing bracket found.`);
   }


  it('XXXX', async () => {
   public invalidNestedParenthesizedExpression(): void {
     this.ParseExpressionExpectException(
       `func[5 * [3 + A]`,
       `(BracketedExpression) No closing bracket found.`);
   }
}
