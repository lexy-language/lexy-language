

export class OperationOrderTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public addAndMultiply(): void {
     let expression = this.ParseExpression(`a + b * c`);
     expression.ValidateOfType<BinaryExpression>(add => {
       add.Operator.ShouldBe(ExpressionOperator.Addition);
       add.Left.ValidateVariableExpression(`a`);
       add.Right.ValidateOfType<BinaryExpression>(multiplication => {
         multiplication.Operator.ShouldBe(ExpressionOperator.Multiplication);
         multiplication.Left.ValidateVariableExpression(`b`);
         multiplication.Right.ValidateVariableExpression(`c`);
       });
     });
   }

  it('XXXX', async () => {
   public addAndMultiplyReverse(): void {
     let expression = this.ParseExpression(`a * b + c`);
     expression.ValidateOfType<BinaryExpression>(add => {
       add.Operator.ShouldBe(ExpressionOperator.Addition);
       add.Left.ValidateOfType<BinaryExpression>(multiplication => {
         multiplication.Operator.ShouldBe(ExpressionOperator.Multiplication);
         multiplication.Left.ValidateVariableExpression(`a`);
         multiplication.Right.ValidateVariableExpression(`b`);
       });
       add.Right.ValidateVariableExpression(`c`);
     });
   }

  it('XXXX', async () => {
   public andAndOr(): void {
     let expression = this.ParseExpression(`a && b || c`);
     expression.ValidateOfType<BinaryExpression>(add => {
       add.Operator.ShouldBe(ExpressionOperator.Or);
       add.Left.ValidateOfType<BinaryExpression>(multiplication => {
         multiplication.Operator.ShouldBe(ExpressionOperator.And);
         multiplication.Left.ValidateVariableExpression(`a`);
         multiplication.Right.ValidateVariableExpression(`b`);
       });
       add.Right.ValidateVariableExpression(`c`);
     });
   }

  it('XXXX', async () => {
   public orAndAn(): void {
     let expression = this.ParseExpression(`a && b || c`);
     expression.ValidateOfType<BinaryExpression>(add => {
       add.Operator.ShouldBe(ExpressionOperator.Or);
       add.Left.ValidateOfType<BinaryExpression>(multiplication => {
         multiplication.Operator.ShouldBe(ExpressionOperator.And);
         multiplication.Left.ValidateVariableExpression(`a`);
         multiplication.Right.ValidateVariableExpression(`b`);
       });
       add.Right.ValidateVariableExpression(`c`);
     });
   }
}
