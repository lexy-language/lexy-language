

export class ExpressionsOperatorsTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public testAdditionOperator(): void {
     ServiceProvider
       .Tokenize(@` X = Y + 1`)
       .Count(5)
       .StringLiteral(0, `X`)
       .Operator(1, OperatorType.Assignment)
       .StringLiteral(2, `Y`)
       .Operator(3, OperatorType.Addition)
       .NumberLiteral(4, 1)
       .Assert();
   }

  it('XXXX', async () => {
   public testSubtractionOperator(): void {
     ServiceProvider
       .Tokenize(@` X = Y - 1`)
       .Count(5)
       .StringLiteral(0, `X`)
       .Operator(1, OperatorType.Assignment)
       .StringLiteral(2, `Y`)
       .Operator(3, OperatorType.Subtraction)
       .NumberLiteral(4, 1)
       .Assert();
   }

  it('XXXX', async () => {
   public testMultiplicationOperator(): void {
     ServiceProvider
       .Tokenize(@` X = Y * 1`)
       .Count(5)
       .StringLiteral(0, `X`)
       .Operator(1, OperatorType.Assignment)
       .StringLiteral(2, `Y`)
       .Operator(3, OperatorType.Multiplication)
       .NumberLiteral(4, 1)
       .Assert();
   }

  it('XXXX', async () => {
   public testDivisionOperator(): void {
     ServiceProvider
       .Tokenize(@` X = Y / 1`)
       .Count(5)
       .StringLiteral(0, `X`)
       .Operator(1, OperatorType.Assignment)
       .StringLiteral(2, `Y`)
       .Operator(3, OperatorType.Division)
       .NumberLiteral(4, 1)
       .Assert();
   }

  it('XXXX', async () => {
   public testModulusOperator(): void {
     ServiceProvider
       .Tokenize(@` X = Y % 1`)
       .Count(5)
       .StringLiteral(0, `X`)
       .Operator(1, OperatorType.Assignment)
       .StringLiteral(2, `Y`)
       .Operator(3, OperatorType.Modulus)
       .NumberLiteral(4, 1)
       .Assert();
   }

  it('XXXX', async () => {
   public testParenthesesOperator(): void {
     ServiceProvider
       .Tokenize(@` X = (Y)`)
       .Count(5)
       .StringLiteral(0, `X`)
       .Operator(1, OperatorType.Assignment)
       .Operator(2, OperatorType.OpenParentheses)
       .StringLiteral(3, `Y`)
       .Operator(4, OperatorType.CloseParentheses)
       .Assert();
   }

  it('XXXX', async () => {
   public testBracketsOperator(): void {
     ServiceProvider
       .Tokenize(@` X = A[1]`)
       .Count(6)
       .StringLiteral(0, `X`)
       .Operator(1, OperatorType.Assignment)
       .StringLiteral(2, `A`)
       .Operator(3, OperatorType.OpenBrackets)
       .NumberLiteral(4, 1)
       .Operator(5, OperatorType.CloseBrackets)
       .Assert();
   }

  it('XXXX', async () => {
   public testLessThanOperator(): void {
     ServiceProvider
       .Tokenize(@` X = A < 7`)
       .Count(5)
       .StringLiteral(0, `X`)
       .Operator(1, OperatorType.Assignment)
       .StringLiteral(2, `A`)
       .Operator(3, OperatorType.LessThan)
       .NumberLiteral(4, 7)
       .Assert();
   }

  it('XXXX', async () => {
   public testLessOrEqualThanOperator(): void {
     ServiceProvider
       .Tokenize(@` X = A <= 7`)
       .Count(5)
       .StringLiteral(0, `X`)
       .Operator(1, OperatorType.Assignment)
       .StringLiteral(2, `A`)
       .Operator(3, OperatorType.LessThanOrEqual)
       .NumberLiteral(4, 7)
       .Assert();
   }

  it('XXXX', async () => {
   public testGreaterThanOperator(): void {
     ServiceProvider
       .Tokenize(@` X = A > 7`)
       .Count(5)
       .StringLiteral(0, `X`)
       .Operator(1, OperatorType.Assignment)
       .StringLiteral(2, `A`)
       .Operator(3, OperatorType.GreaterThan)
       .NumberLiteral(4, 7)
       .Assert();
   }

  it('XXXX', async () => {
   public testGreaterOrEqualThanOperator(): void {
     ServiceProvider
       .Tokenize(@` X = A >= 7`)
       .Count(5)
       .StringLiteral(0, `X`)
       .Operator(1, OperatorType.Assignment)
       .StringLiteral(2, `A`)
       .Operator(3, OperatorType.GreaterThanOrEqual)
       .NumberLiteral(4, 7)
       .Assert();
   }

  it('XXXX', async () => {
   public testFunctionCallOperator(): void {
     ServiceProvider
       .Tokenize(@` X = abs(Y + 8)`)
       .Count(8)
       .StringLiteral(0, `X`)
       .Operator(1, OperatorType.Assignment)
       .StringLiteral(2, `abs`)
       .Operator(3, OperatorType.OpenParentheses)
       .StringLiteral(4, `Y`)
       .Operator(5, OperatorType.Addition)
       .NumberLiteral(6, 8)
       .Operator(7, OperatorType.CloseParentheses)
       .Assert();
   }
}
