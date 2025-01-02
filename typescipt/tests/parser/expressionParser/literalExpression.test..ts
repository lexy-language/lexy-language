

export class LiteralExpressionTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public number(): void {
     let expression = this.ParseExpression(`456`);
     expression.ValidateNumericLiteralExpression(456);
   }

  it('XXXX', async () => {
   public negativeNumber(): void {
     let expression = this.ParseExpression(`-456`);
     expression.ValidateNumericLiteralExpression(-456);
   }

  it('XXXX', async () => {
   public subtraction(): void {
     let expression = this.ParseExpression(`789-456`);
     expression.ValidateOfType<BinaryExpression>(expression => {
       expression.Operator.ShouldBe(ExpressionOperator.Subtraction);
       expression.Left.ValidateNumericLiteralExpression(789);
       expression.Right.ValidateNumericLiteralExpression(456);
     });
   }

  it('XXXX', async () => {
   public doubleSubtraction(): void {
     let expression = this.ParseExpression(`789 - -456`);
     expression.ValidateOfType<BinaryExpression>(expression => {
       expression.Operator.ShouldBe(ExpressionOperator.Subtraction);
       expression.Left.ValidateNumericLiteralExpression(789);
       expression.Right.ValidateNumericLiteralExpression(-456);
     });
   }

  it('XXXX', async () => {
   public doubleSubtractionWithSpace(): void {
     let expression = this.ParseExpression(`789 - -456`);
     expression.ValidateOfType<BinaryExpression>(subtraction => {
       subtraction.Operator.ShouldBe(ExpressionOperator.Subtraction);
       subtraction.Left.ValidateNumericLiteralExpression(789);
       subtraction.Right.ValidateNumericLiteralExpression(-456);
     });
   }

  it('XXXX', async () => {
   public functionCallWithNegativeNumber(): void {
     let expression = this.ParseExpression(`Result = ABS(-2)`);
     expression.ValidateOfType<AssignmentExpression>(assignment => {
       assignment.Variable.ValidateIdentifierExpression(`Result`);
       assignment.Assignment.ValidateOfType<FunctionCallExpression>(functionCall => {
         functionCall.functionName.ShouldBe(`ABS`);
         functionCall.Arguments.Count.ShouldBe(1);
         functionCall.Arguments[0].ValidateNumericLiteralExpression(-2);
       });
     });
   }
}
