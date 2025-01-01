

export class DeriveTypeTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public numberLiteral(): void {
     let type = DeriveType(`5`);
     type.ShouldBe(PrimitiveType.Number);
   }

  it('XXXX', async () => {
   public stringLiteral(): void {
     let type = DeriveType(@```abc```);
     type.ShouldBe(PrimitiveType.String);
   }

  it('XXXX', async () => {
   public booleanLiteral(): void {
     let type = DeriveType(@`true`);
     type.ShouldBe(PrimitiveType.Boolean);
   }

  it('XXXX', async () => {
   public booleanLiteralFalse(): void {
     let type = DeriveType(@`false`);
     type.ShouldBe(PrimitiveType.Boolean);
   }

  it('XXXX', async () => {
   public dateTimeLiteral(): void {
     let type = DeriveType(@`d``2024-12-24T10:05:00```);
     type.ShouldBe(PrimitiveType.Date);
   }

  it('XXXX', async () => {
   public numberCalculationLiteral(): void {
     let type = DeriveType(@`5 + 5`);
     type.ShouldBe(PrimitiveType.Number);
   }

  it('XXXX', async () => {
   public stringConcatLiteral(): void {
     let type = DeriveType(@```abc`` + ``def```);
     type.ShouldBe(PrimitiveType.String);
   }

  it('XXXX', async () => {
   public booleanLogicalLiteral(): void {
     let type = DeriveType(@`true && false`);
     type.ShouldBe(PrimitiveType.Boolean);
   }

  it('XXXX', async () => {
   public stringVariable(): void {
     let type = DeriveType(@`a`, context => {
       let reference = new SourceReference(new SourceFile(`tests.lexy`), 1, 1);
       context.VariableContext.RegisterVariableAndVerifyUnique(reference, `a`, PrimitiveType.String,
         VariableSource.Results);
     });

     type.ShouldBe(PrimitiveType.String);
   }

  it('XXXX', async () => {
   public numberVariable(): void {
     let type = DeriveType(@`a`, context => {
       let reference = new SourceReference(new SourceFile(`tests.lexy`), 1, 1);
       context.VariableContext.RegisterVariableAndVerifyUnique(reference, `a`, PrimitiveType.Number,
         VariableSource.Results);
     });
     type.ShouldBe(PrimitiveType.Number);
   }

  it('XXXX', async () => {
   public booleanVariable(): void {
     let type = DeriveType(@`a`, context => {
       let reference = new SourceReference(new SourceFile(`tests.lexy`), 1, 1);
       context.VariableContext.RegisterVariableAndVerifyUnique(reference, `a`, PrimitiveType.Boolean,
         VariableSource.Results);
     });
     type.ShouldBe(PrimitiveType.Boolean);
   }

  it('XXXX', async () => {
   public dateTimeVariable(): void {
     let type = DeriveType(@`a`, context => {
       let reference = new SourceReference(new SourceFile(`tests.lexy`), 1, 1);
       context.VariableContext.RegisterVariableAndVerifyUnique(reference, `a`, PrimitiveType.Date,
         VariableSource.Results);
     });
     type.ShouldBe(PrimitiveType.Date);
   }

  it('XXXX', async () => {
   public stringVariableConcat(): void {
     let type = DeriveType(@`a + ``bc```, context => {
       let reference = new SourceReference(new SourceFile(`tests.lexy`), 1, 1);
       context.VariableContext.RegisterVariableAndVerifyUnique(reference, `a`, PrimitiveType.String,
         VariableSource.Results);
     });
     type.ShouldBe(PrimitiveType.String);
   }

  it('XXXX', async () => {
   public numberVariableCalculation(): void {
     let type = DeriveType(@`a + 20`, context => {
       let reference = new SourceReference(new SourceFile(`tests.lexy`), 1, 1);
       context.VariableContext.RegisterVariableAndVerifyUnique(reference, `a`, PrimitiveType.Number,
         VariableSource.Results);
     });
     type.ShouldBe(PrimitiveType.Number);
   }

  it('XXXX', async () => {
   public numberVariableWithParenthesisCalculation(): void {
     let type = DeriveType(@`(a + 20.05) * 3`, context => {
       let reference = new SourceReference(new SourceFile(`tests.lexy`), 1, 1);
       context.VariableContext.RegisterVariableAndVerifyUnique(reference, `a`, PrimitiveType.Number,
         VariableSource.Results);
     });
     type.ShouldBe(PrimitiveType.Number);
   }

   private deriveType(expressionValue: string, validationContextHandler: Action<IValidationContext> =: Action<IValidationContext> null: Action<IValidationContext>): VariableType {
     let parserContext = GetService<IParserContext>();
     let validationContext = new ValidationContext(parserContext.Logger, parserContext.Nodes);
     using let _ = validationContext.CreateVariableScope();

     validationContextHandler?.Invoke(validationContext);

     let expression = this.ParseExpression(expressionValue);
     return expression.DeriveType(validationContext);
   }
}
