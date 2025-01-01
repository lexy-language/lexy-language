

export class BinaryExpressionTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public addition(): void {
     let expression = this.ParseExpression(`B + C`);
     expression.ValidateOfType<BinaryExpression>(addition => {
       addition.Operator.ShouldBe(ExpressionOperator.Addition);
       addition.Left.ValidateVariableExpression(`B`);
       addition.Right.ValidateVariableExpression(`C`);
     });
   }

  it('XXXX', async () => {
   public subtraction(): void {
     let expression = this.ParseExpression(`B - C`);
     expression.ValidateOfType<BinaryExpression>(addition => {
       addition.Operator.ShouldBe(ExpressionOperator.Subtraction);
       addition.Left.ValidateVariableExpression(`B`);
       addition.Right.ValidateVariableExpression(`C`);
     });
   }

  it('XXXX', async () => {
   public additionAndMultiplication(): void {
     let expression = this.ParseExpression(`B + C * 12`);
     expression.ValidateOfType<BinaryExpression>(addition => {
       addition.Operator.ShouldBe(ExpressionOperator.Addition);
       addition.Left.ValidateVariableExpression(`B`);
       addition.Right.ValidateOfType<BinaryExpression>(multiplication => {
         multiplication.Operator.ShouldBe(ExpressionOperator.Multiplication);
         multiplication.Left.ValidateVariableExpression(`C`);
         multiplication.Right.ValidateNumericLiteralExpression(12m);
       });
     });
   }

  it('XXXX', async () => {
   public divisionTests(): void {
     let expression = this.ParseExpression(`B / 12`);
     expression.ValidateOfType<BinaryExpression>(multiplication => {
       multiplication.Operator.ShouldBe(ExpressionOperator.Division);
       multiplication.Left.ValidateVariableExpression(`B`);
       multiplication.Right.ValidateNumericLiteralExpression(12m);
     });
   }

  it('XXXX', async () => {
   public modulusTests(): void {
     let expression = this.ParseExpression(`B % 12`);
     expression.ValidateOfType<BinaryExpression>(multiplication => {
       multiplication.Operator.ShouldBe(ExpressionOperator.Modulus);
       multiplication.Left.ValidateVariableExpression(`B`);
       multiplication.Right.ValidateNumericLiteralExpression(12m);
     });
   }

  it('XXXX', async () => {
   public greaterThan(): void {
     let expression = this.ParseExpression(`B > 12`);

     expression.ValidateOfType<BinaryExpression>(multiplication => {
       multiplication.Operator.ShouldBe(ExpressionOperator.GreaterThan);
       multiplication.Left.ValidateVariableExpression(`B`);
       multiplication.Right.ValidateNumericLiteralExpression(12m);
     });
   }

  it('XXXX', async () => {
   public greaterThanOrEqual(): void {
     let expression = this.ParseExpression(`B >= 12`);

     expression.ValidateOfType<BinaryExpression>(multiplication => {
       multiplication.Operator.ShouldBe(ExpressionOperator.GreaterThanOrEqual);
       multiplication.Left.ValidateVariableExpression(`B`);
       multiplication.Right.ValidateNumericLiteralExpression(12m);
     });
   }


  it('XXXX', async () => {
   public lessThan(): void {
     let expression = this.ParseExpression(`B < 12`);

     expression.ValidateOfType<BinaryExpression>(multiplication => {
       multiplication.Operator.ShouldBe(ExpressionOperator.LessThan);
       multiplication.Left.ValidateVariableExpression(`B`);
       multiplication.Right.ValidateNumericLiteralExpression(12m);
     });
   }

  it('XXXX', async () => {
   public lessThanOrEqual(): void {
     let expression = this.ParseExpression(`B <= 12`);

     expression.ValidateOfType<BinaryExpression>(multiplication => {
       multiplication.Operator.ShouldBe(ExpressionOperator.LessThanOrEqual);
       multiplication.Left.ValidateVariableExpression(`B`);
       multiplication.Right.ValidateNumericLiteralExpression(12m);
     });
   }

  it('XXXX', async () => {
   public equals(): void {
     let expression = this.ParseExpression(`B == 12`);

     expression.ValidateOfType<BinaryExpression>(multiplication => {
       multiplication.Operator.ShouldBe(ExpressionOperator.Equals);
       multiplication.Left.ValidateVariableExpression(`B`);
       multiplication.Right.ValidateNumericLiteralExpression(12m);
     });
   }

  it('XXXX', async () => {
   public notEqual(): void {
     let expression = this.ParseExpression(`B != 12`);

     expression.ValidateOfType<BinaryExpression>(multiplication => {
       multiplication.Operator.ShouldBe(ExpressionOperator.NotEqual);
       multiplication.Left.ValidateVariableExpression(`B`);
       multiplication.Right.ValidateNumericLiteralExpression(12m);
     });
   }

  it('XXXX', async () => {
   public and(): void {
     let expression = this.ParseExpression(`B && 12`);

     expression.ValidateOfType<BinaryExpression>(multiplication => {
       multiplication.Operator.ShouldBe(ExpressionOperator.And);
       multiplication.Left.ValidateVariableExpression(`B`);
       multiplication.Right.ValidateNumericLiteralExpression(12m);
     });
   }

  it('XXXX', async () => {
   public or(): void {
     let expression = this.ParseExpression(`B || 12`);

     expression.ValidateOfType<BinaryExpression>(multiplication => {
       multiplication.Operator.ShouldBe(ExpressionOperator.Or);
       multiplication.Left.ValidateVariableExpression(`B`);
       multiplication.Right.ValidateNumericLiteralExpression(12m);
     });
   }
}
