import {parseNodes} from "../parseFunctions";

describe('ParseFunctionTests', () => {
  it('testDuplicatedFunctionName', async () => {
    const code = `Function: ValidateTableKeyword
# Validate table keywords
  Include
   table ValidateTableKeyword
  Parameters
  Results
   number Result
  Code
   Result = ValidateTableKeyword.length

Function: ValidateTableKeyword
# Validate table keywords
  Include
   table ValidateTableKeyword
  Parameters
  Results
   number Result
  Code
   Result = ValidateTableKeyword.length`;

    const {logger} = parseNodes(code);
    expect(logger.hasErrorMessage(`Duplicated node name: 'ValidateTableKeyword'`))
      .toBe(true);
  });
});
