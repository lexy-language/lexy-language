

export class ParseFunctionTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public testDuplicatedFunctionName(): void {
     let code = `Function: ValidateTableKeyword
# Validate table keywords
  Include
   table ValidateTableKeyword
  Parameters
  Results
   number Result
  Code
   Result = ValidateTableKeyword.Count

Function: ValidateTableKeyword
# Validate table keywords
  Include
   table ValidateTableKeyword
  Parameters
  Results
   number Result
  Code
   Result = ValidateTableKeyword.Count`;

     let parser = GetService<ILexyParser>();
     parser.ParseNodes(code);

     let logger = GetService<IParserLogger>();
     logger.HasErrorMessage(`Duplicated node name: 'ValidateTableKeyword'`)
      .ShouldBeTrue(logger.FormatMessages());
   }
}
