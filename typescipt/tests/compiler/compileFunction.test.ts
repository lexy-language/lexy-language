import {compileFunction} from "./compileFunction";

describe('CompileFunctionTests', () => {
  it('testSimpleReturn', async () => {
     let script = compileFunction(`Function: TestSimpleReturn
  Results
    number Result
  Code
    Result = 777`);
     const result = script.run();
     expect(result.number(`Result`)).toBe(777);
   });

  it('testParameterDefaultReturn', async () => {
     let script = compileFunction(`Function: TestSimpleReturn
  Parameters
    number Input = 5
  Results
    number Result
  Code
    Result = Input`);
     let result = script.run();
     expect(result.number(`Result`)).toBe(5);
   });

  it('testAssignmentReturn', async () => {
     let script = compileFunction(`Function: TestSimpleReturn
  Parameters
    number Input = 5

  Results
    number Result
  Code
    Result = Input`);
     let result = script.run({
       Input: 777
     });
     expect(result.number(`Result`)).toBe(777);
   });


  it('testMemberAccessAssignment', async () => {
     let script = compileFunction(`Table: ValidateTableKeyword
# Validate table keywords
  | number Value | number Result |
  | 0 | 0 |
  | 1 | 1 |

Function: ValidateTableKeywordFunction
# Validate table keywords
  Parameters
  Results
    number Result
  Code
    Result = ValidateTableKeyword.Count`);

     let result = script.run();
     expect(result.number(`Result`)).toBe(2);
   });

  it('variableDeclarationInCode', async () => {
     let script = compileFunction(`Function: TestSimpleReturn
  Parameters
    number Value = 5 
  Results
    number Result
  Code
    number temp = 5
    temp = Value 
    Result = temp`);

     let result = script.run();
     expect(result.number(`Result`)).toBe(5);
   });

  it('variableDeclarationWithDefaultInCode', async () => {
     let script = compileFunction(`Function: TestSimpleReturn
  Results
    number Result
  Code
    number temp = 5
    Result = temp
`);
     let result = script.run();
     expect(result.number(`Result`)).toBe(5);
   });
});
