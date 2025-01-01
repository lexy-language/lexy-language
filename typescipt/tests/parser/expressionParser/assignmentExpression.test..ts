

export class AssignmentExpressionTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public addition(): void {
     let expression = this.ParseExpression(`A = B + C`);
     expression.ValidateOfType<AssignmentExpression>(assignmentExpression => {
       assignmentExpression.Variable.ValidateIdentifierExpression(`A`);
       assignmentExpression.Assignment.ValidateOfType<BinaryExpression>(addition => {
         addition.Operator.ShouldBe(ExpressionOperator.Addition);
         addition.Left.ValidateVariableExpression(`B`);
         addition.Right.ValidateVariableExpression(`C`);
       });
     });
   }

  it('XXXX', async () => {
   public additionAndMultiplication(): void {
     let expression = this.ParseExpression(`A = B + C * 12`);
     expression.ValidateOfType<AssignmentExpression>(assignment => {
       assignment.Variable.ValidateIdentifierExpression(`A`);
       assignment.Assignment.ValidateOfType<BinaryExpression>(addition => {
         addition.Operator.ShouldBe(ExpressionOperator.Addition);
         addition.Left.ValidateVariableExpression(`B`);
         addition.Right.ValidateOfType<BinaryExpression>(multiplication => {
           multiplication.Operator.ShouldBe(ExpressionOperator.Multiplication);
           multiplication.Left.ValidateVariableExpression(`C`);
           multiplication.Right.ValidateNumericLiteralExpression(12m);
         });
       });
     });
   }
}
