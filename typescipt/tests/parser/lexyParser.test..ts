

export class LexyParserTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public testSimpleReturn(): void {
     let code = @`Function: TestSimpleReturn
  Results
   number Result
  Code
   Result = 777`;

     let parser = ServiceProvider.GetRequiredService<ILexyParser>();
     let script = parser.ParseFunction(code);

     script.Name.Value.ShouldBe(`TestSimpleReturn`);
     script.Results.Variables.Count.ShouldBe(1);
     script.Results.Variables[0].Name.ShouldBe(`Result`);
     script.Results.Variables[0].Type.ValidateOfType<PrimitiveVariableDeclarationType>(type =>
       ShouldBeStringTestExtensions.ShouldBe(type.Type, `number`));
     script.Code.Expressions.Count.ShouldBe(1);
     script.Code.Expressions[0].ToString().ShouldBe(`Result=777`);
   }

  it('XXXX', async () => {
   public testFunctionKeywords(): void {
     let code = @`Function: ValidateFunctionKeywords
# Validate function keywords
  Parameters
  Results
  Code`;

     let parser = ServiceProvider.GetRequiredService<ILexyParser>();
     parser.ParseFunction(code);
   }
}
