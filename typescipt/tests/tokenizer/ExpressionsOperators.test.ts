import {tokenize} from "./tokenize";
import {OperatorType} from "../../src/parser/tokens/operatorType";

describe('ExpressionsOperatorsTests', () => {
  it('TestAdditionOperator', async () => {
    tokenize("  X = Y + 1")
      .count(5)
      .stringLiteral(0, "X")
      .operator(1, OperatorType.Assignment)
      .stringLiteral(2, "Y")
      .operator(3, OperatorType.Addition)
      .numberLiteral(4, 1)
      .assert();
  });

  it('TestSubtractionOperator', async () => {
    tokenize("  X = Y - 1").count(5)
      .stringLiteral(0, "X")
      .operator(1, OperatorType.Assignment)
      .stringLiteral(2, "Y")
      .operator(3, OperatorType.Subtraction)
      .numberLiteral(4, 1)
      .assert();
  });

  it('TestMultiplicationOperator', async () => {
    tokenize("  X = Y * 1").count(5)
      .stringLiteral(0, "X")
      .operator(1, OperatorType.Assignment)
      .stringLiteral(2, "Y")
      .operator(3, OperatorType.Multiplication)
      .numberLiteral(4, 1)
      .assert();
  });

  it('TestDivisionOperator', async () => {
    tokenize("  X = Y / 1").count(5)
      .stringLiteral(0, "X")
      .operator(1, OperatorType.Assignment)
      .stringLiteral(2, "Y")
      .operator(3, OperatorType.Division)
      .numberLiteral(4, 1)
      .assert();
  });

  it('TestModulusOperator', async () => {
    tokenize("  X = Y % 1").count(5)
      .stringLiteral(0, "X")
      .operator(1, OperatorType.Assignment)
      .stringLiteral(2, "Y")
      .operator(3, OperatorType.Modulus)
      .numberLiteral(4, 1)
      .assert();
  });

  it('TestParenthesesOperator', async () => {
    tokenize("  X = (Y)").count(5)
      .stringLiteral(0, "X")
      .operator(1, OperatorType.Assignment)
      .operator(2, OperatorType.OpenParentheses)
      .stringLiteral(3, "Y")
      .operator(4, OperatorType.CloseParentheses)
      .assert();
  });

  it('TestBracketsOperator', async () => {
    tokenize("  X = A[1]").count(6)
      .stringLiteral(0, "X")
      .operator(1, OperatorType.Assignment)
      .stringLiteral(2, "A")
      .operator(3, OperatorType.OpenBrackets)
      .numberLiteral(4, 1)
      .operator(5, OperatorType.CloseBrackets)
      .assert();
  });

  it('TestLessThanOperator', async () => {
    tokenize("  X = A < 7").count(5)
      .stringLiteral(0, "X")
      .operator(1, OperatorType.Assignment)
      .stringLiteral(2, "A")
      .operator(3, OperatorType.LessThan)
      .numberLiteral(4, 7)
      .assert();
  });

  it('TestLessOrEqualThanOperator', async () => {
    tokenize("  X = A <= 7").count(5)
      .stringLiteral(0, "X")
      .operator(1, OperatorType.Assignment)
      .stringLiteral(2, "A")
      .operator(3, OperatorType.LessThanOrEqual)
      .numberLiteral(4, 7)
      .assert();
  });

  it('TestGreaterThanOperator', async () => {
    tokenize("  X = A > 7").count(5)
      .stringLiteral(0, "X")
      .operator(1, OperatorType.Assignment)
      .stringLiteral(2, "A")
      .operator(3, OperatorType.GreaterThan)
      .numberLiteral(4, 7)
      .assert();
  });

  it('TestGreaterOrEqualThanOperator', async () => {
    tokenize("  X = A >= 7").count(5)
      .stringLiteral(0, "X")
      .operator(1, OperatorType.Assignment)
      .stringLiteral(2, "A")
      .operator(3, OperatorType.GreaterThanOrEqual)
      .numberLiteral(4, 7)
      .assert();
  });

  it('TestFunctionCallOperator', async () => {
    tokenize("  X = abs(Y + 8)").count(8)
      .stringLiteral(0, "X")
      .operator(1, OperatorType.Assignment)
      .stringLiteral(2, "abs")
      .operator(3, OperatorType.OpenParentheses)
      .stringLiteral(4, "Y")
      .operator(5, OperatorType.Addition)
      .numberLiteral(6, 8)
      .operator(7, OperatorType.CloseParentheses)
      .assert();
  });
});