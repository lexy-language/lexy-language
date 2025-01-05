import {tokenize, tokenizeExpectError} from "./tokenize";
import {OperatorType} from "../../src/parser/tokens/operatorType";

describe('KeywordTests', () => {
  it('TestFunctionKeyword', async () => {
    tokenize("Function: TestSimpleReturn")
      .count(2)
      .keyword(0, "Function:")
      .stringLiteral(1, "TestSimpleReturn")
      .assert();
  });

  it('TestResultKeyword', async () => {
    tokenize("  Results").count(1)
      .keyword(0, "Results")
      .assert();
  });

  it('TestExpectErrorKeywordWithQuotedLiteral', async () => {
    tokenize("  ExpectError \"Invalid token 'Paraeters'\"")
      .count(2)
      .keyword(0, "ExpectError")
      .quotedString(1, "Invalid token 'Paraeters'")
      .assert();
  });

  it('TestExpectErrorKeywordWithQuotedAndInvalidChar', async () => {
    let result = tokenizeExpectError("  ExpectError \"Invalid token 'Paraeters'\".");
    expect(result.errorMessage).toBe("Invalid character at 41 '.'");
  });

  it('TestAssignmentWithMemberAccess', async () => {
    tokenize("  Value = ValidateEnumKeyword.Second").count(3)
      .stringLiteral(0, "Value")
      .operator(1, OperatorType.Assignment)
      .memberAccess(2, "ValidateEnumKeyword.Second")
      .assert();
  });

  it('TestAssignmentWithDoubleMemberAccess', async () => {
    let result = tokenizeExpectError("  Value = ValidateEnumKeyword..Second");
    expect(result.errorMessage).toBe("Unexpected character: '.'. Member accessor should be followed by member name.");
  });

  it('TestAssignmentWithMemberAccessWithoutLastMember', async () => {
    let result = tokenizeExpectError("  Value = ValidateEnumKeyword.")
    expect(result.errorMessage).toBe("Invalid token at end of line. Unexpected end of line. Member accessor should be followed by member name.");
  });
});