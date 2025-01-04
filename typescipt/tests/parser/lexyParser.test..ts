

export class LexyParserTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public testSimpleReturn(): void {
     let code = `Function: TestSimpleReturn
  Results
   number Result
  Code
   Result = 777`;

     let parser = ServiceProvider.GetRequiredService<ILexyParser>();
     let script = parser.ParseFunction(code);

     script.Name.Value.toBe(`TestSimpleReturn`);
     script.results.Variables.Count.toBe(1);
     script.results.Variables[0].Name.toBe(`Result`);
     script.results.Variables[0].Type.validateOfType<PrimitiveVariableDeclarationType>(type =>
       ShouldBeStringTestExtensions.toBe(type.type, `number`));
     script.Code.Expressions.Count.toBe(1);
     script.Code.Expressions[0].toString().toBe(`Result=777`);
   }

  it('XXXX', async () => {
   public testFunctionKeywords(): void {
     let code = `Function: ValidateFunctionKeywords
# Validate function keywords
  Parameters
  Results
  Code`;

     let parser = ServiceProvider.GetRequiredService<ILexyParser>();
     parser.ParseFunction(code);
   }
}
