

export class FunctionCallExpressionTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public functionCallExpression(): void {
     let expression = this.ParseExpression(`INT(y)`);
     expression.ValidateOfType<FunctionCallExpression>(functionCallExpression => {
       functionCallExpression.FunctionName.ShouldBe(`INT`);
       functionCallExpression.ExpressionFunction.ValidateOfType<IntFunction>(function =>
         function.ValueExpression.ValidateVariableExpression(`y`));
     });
   }

  it('XXXX', async () => {
   public nestedParenthesizedExpression(): void {
     let expression = this.ParseExpression(`INT(5 * (3 + A))`);
     expression.ValidateOfType<FunctionCallExpression>(functionCall => {
       functionCall.FunctionName.ShouldBe(`INT`);
       functionCall.ExpressionFunction.ValidateOfType<IntFunction>(function =>
         function.ValueExpression.ValidateOfType<BinaryExpression>(multiplication =>
           multiplication.Right.ValidateOfType<ParenthesizedExpression>(inner =>
             inner.Expression.ValidateOfType<BinaryExpression>(addition =>
               addition.Operator.ShouldBe(ExpressionOperator.Addition)))));
     });
   }

  it('XXXX', async () => {
   public nestedParenthesizedMultipleArguments(): void {
     let expression = this.ParseExpression(`ROUND(POWER(98.6,3.2),3)`);
     expression.ValidateOfType<FunctionCallExpression>(round => {
       round.FunctionName.ShouldBe(`ROUND`);
       round.Arguments.Count.ShouldBe(2);
       round.Arguments[0].ValidateOfType<FunctionCallExpression>(power => {
         power.Arguments.Count.ShouldBe(2);
         power.Arguments[0].ValidateNumericLiteralExpression(98.6m);
         power.Arguments[1].ValidateNumericLiteralExpression(3.2m);
       });
       round.Arguments[1].ValidateNumericLiteralExpression(3);
     });
   }

  it('XXXX', async () => {
   public callExtract(): void {
     let expression = this.ParseExpression(`extract(results)`);
     expression.ValidateOfType<FunctionCallExpression>(round => {
       round.FunctionName.ShouldBe(`extract`);
       round.Arguments.Count.ShouldBe(1);
       round.Arguments[0].ValidateIdentifierExpression(`results`);
     });
   }

  it('XXXX', async () => {
   public invalidParenthesizedExpression(): void {
     this.ParseExpressionExpectException(
       `func(A`,
       `(FunctionCallExpression) No closing parentheses found.`);
   }


  it('XXXX', async () => {
   public invalidNestedParenthesizedExpression(): void {
     this.ParseExpressionExpectException(
       `func(5 * (3 + A)`,
       `(FunctionCallExpression) No closing parentheses found.`);
   }
}
