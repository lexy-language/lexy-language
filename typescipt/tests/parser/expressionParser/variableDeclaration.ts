

export class VariableDeclaration extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public number(): void {
     let expression = this.ParseExpression(`number temp`);
     expression.ValidateOfType<VariableDeclarationExpression>(assignmentExpression => {
       assignmentExpression.Type.ValidateOfType<PrimitiveVariableDeclarationType>(type =>
         type.Type.ShouldBe(`number`));
       assignmentExpression.Name.ShouldBe(`temp`);
       assignmentExpression.Assignment.ShouldBeNull();
     });
   }

  it('XXXX', async () => {
   public numberWithDefaultValue(): void {
     let expression = this.ParseExpression(`number temp = 123.45`);
     expression.ValidateOfType<VariableDeclarationExpression>(assignmentExpression => {
       assignmentExpression.Type.ValidateOfType<PrimitiveVariableDeclarationType>(type =>
         type.Type.ShouldBe(`number`));
       assignmentExpression.Name.ShouldBe(`temp`);
       assignmentExpression.Assignment.ValidateNumericLiteralExpression(123.45m);
     });
   }

  it('XXXX', async () => {
   public string(): void {
     let expression = this.ParseExpression(`string temp`);
     expression.ValidateOfType<VariableDeclarationExpression>(assignmentExpression => {
       assignmentExpression.Type.ValidateOfType<PrimitiveVariableDeclarationType>(type =>
         type.Type.ShouldBe(`string`));
       assignmentExpression.Name.ShouldBe(`temp`);
       assignmentExpression.Assignment.ShouldBeNull();
     });
   }

  it('XXXX', async () => {
   public stringWithDefaultValue(): void {
     let expression = this.ParseExpression(`string temp = "abc"`);
     expression.ValidateOfType<VariableDeclarationExpression>(assignmentExpression => {
       assignmentExpression.Type.ValidateOfType<PrimitiveVariableDeclarationType>(type =>
         type.Type.ShouldBe(`string`));
       assignmentExpression.Name.ShouldBe(`temp`);
       assignmentExpression.Assignment.ValidateQuotedLiteralExpression(`abc`);
     });
   }


  it('XXXX', async () => {
   public boolean(): void {
     let expression = this.ParseExpression(`boolean temp`);
     expression.ValidateOfType<VariableDeclarationExpression>(assignmentExpression => {
       assignmentExpression.Type.ValidateOfType<PrimitiveVariableDeclarationType>(type =>
         type.Type.ShouldBe(`boolean`));
       assignmentExpression.Name.ShouldBe(`temp`);
       assignmentExpression.Assignment.ShouldBeNull();
     });
   }

  it('XXXX', async () => {
   public booleanWithDefaultValue(): void {
     let expression = this.ParseExpression(`boolean temp = true`);
     expression.ValidateOfType<VariableDeclarationExpression>(assignmentExpression => {
       assignmentExpression.Type.ValidateOfType<PrimitiveVariableDeclarationType>(type =>
         type.Type.ShouldBe(`boolean`));
       assignmentExpression.Name.ShouldBe(`temp`);
       assignmentExpression.Assignment.ValidateBooleanLiteralExpression(true);
     });
   }

  it('XXXX', async () => {
   public dateTime(): void {
     let expression = this.ParseExpression(`date temp`);
     expression.ValidateOfType<VariableDeclarationExpression>(assignmentExpression => {
       assignmentExpression.Type.ValidateOfType<PrimitiveVariableDeclarationType>(type =>
         type.Type.ShouldBe(`date`));
       assignmentExpression.Name.ShouldBe(`temp`);
       assignmentExpression.Assignment.ShouldBeNull();
     });
   }

  it('XXXX', async () => {
   public dateTimeWithDefaultValue(): void {
     let expression = this.ParseExpression(`date temp = d"2024-12-16T16:51:12");
     expression.ValidateOfType<VariableDeclarationExpression>(assignmentExpression => {
       assignmentExpression.Type.ValidateOfType<PrimitiveVariableDeclarationType>(type =>
         type.Type.ShouldBe(`date`));
       assignmentExpression.Name.ShouldBe(`temp`);
       assignmentExpression.Assignment.ValidateDateTimeLiteralExpression(new DateTime(2024, 12, 16, 16, 51, 12));
     });
   }

  it('XXXX', async () => {
   public customType(): void {
     let expression = this.ParseExpression(`Custom temp`);
     expression.ValidateOfType<VariableDeclarationExpression>(assignmentExpression => {
       assignmentExpression.Type.ValidateOfType<CustomVariableDeclarationType>(type =>
         type.Type.ShouldBe(`Custom`));
       assignmentExpression.Name.ShouldBe(`temp`);
       assignmentExpression.Assignment.ShouldBeNull();
     });
   }

  it('XXXX', async () => {
   public customTypeWithDefault(): void {
     let expression = this.ParseExpression(`Custom temp = Custom.First`);
     expression.ValidateOfType<VariableDeclarationExpression>(assignmentExpression => {
       assignmentExpression.Type.ValidateOfType<CustomVariableDeclarationType>(type =>
         type.Type.ShouldBe(`Custom`));
       assignmentExpression.Name.ShouldBe(`temp`);
       assignmentExpression.Assignment.ValidateMemberAccessExpression(`Custom.First`);
     });
   }
}
