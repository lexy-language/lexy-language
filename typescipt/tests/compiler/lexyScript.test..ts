

export class LexyScriptTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public testSimpleReturn(): void {
     let script = ServiceScope.CompileFunction(@`Function: TestSimpleReturn
  Results
   number Result
  Code
   Result = 777`);
     let result = script.Run();
     result.Number(`Result`).ShouldBe(777);
   }

  it('XXXX', async () => {
   public testParameterDefaultReturn(): void {
     let script = ServiceScope.CompileFunction(@`Function: TestSimpleReturn
  Parameters
   number Input = 5
  Results
   number Result
  Code
   Result = Input`);
     let result = script.Run();
     result.Number(`Result`).ShouldBe(5);
   }

  it('XXXX', async () => {
   public testAssignmentReturn(): void {
     let script = ServiceScope.CompileFunction(@`Function: TestSimpleReturn
  Parameters
   number Input = 5

  Results
   number Result
  Code
   Result = Input`);
     let result = script.Run(new Dictionary<string, object> {
       { `Input`, 777 }
     });
     result.Number(`Result`).ShouldBe(777);
   }


  it('XXXX', async () => {
   public testMemberAccessAssignment(): void {
     let script = ServiceScope.CompileFunction(@`Table: ValidateTableKeyword
# Validate table keywords
  | number Value | number Result |
  | 0 | 0 |
  | 1 | 1 |

Function: ValidateTableKeywordFunction
# Validate table keywords
  Include
   table ValidateTableKeyword
  Parameters
  Results
   number Result
  Code
   Result = ValidateTableKeyword.Count`);

     let result = script.Run();
     result.Number(`Result`).ShouldBe(2);
   }

  it('XXXX', async () => {
   public variableDeclarationInCode(): void {
     let script = ServiceScope.CompileFunction(@`Function: TestSimpleReturn
  Parameters
   number Value = 5 
  Results
   number Result
  Code
   number temp = 5
   temp = Value 
   Result = temp`);

     let result = script.Run();
     result.Number(`Result`).ShouldBe(5);
   }

  it('XXXX', async () => {
   public variableDeclarationWithDefaultInCode(): void {
     let script = ServiceScope.CompileFunction(@`Function: TestSimpleReturn
  Results
   number Result
  Code
   number temp = 5
   Result = temp
`);
     let result = script.Run();
     result.Number(`Result`).ShouldBe(5);
   }
}
