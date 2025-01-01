

export class KeywordTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public testFunctionKeyword(): void {
     ServiceProvider
       .Tokenize(`Function: TestSimpleReturn`)
       .Count(2)
       .Keyword(0, `Function:`)
       .StringLiteral(1, `TestSimpleReturn`)
       .Assert();
   }

  it('XXXX', async () => {
   public testResultKeyword(): void {
     ServiceProvider
       .Tokenize(` Results`)
       .Count(1)
       .Keyword(0, `Results`)
       .Assert();
   }

  it('XXXX', async () => {
   public testExpectErrorKeywordWithQuotedLiteral(): void {
     ServiceProvider
       .Tokenize(@` ExpectError ``Invalid token 'Paraeters'```)
       .Count(2)
       .Keyword(0, `ExpectError`)
       .QuotedString(1, `Invalid token 'Paraeters'`)
       .Assert();
   }

  it('XXXX', async () => {
   public testExpectErrorKeywordWithQuotedAndInvalidChar(): void {
     ServiceProvider
       .TokenizeExpectError(@` ExpectError ``Invalid token 'Paraeters'``.`)
       .ErrorMessage.ShouldContain(@`Invalid character at 41 '.'`);
   }

  it('XXXX', async () => {
   public testAssignmentWithMemberAccess(): void {
     ServiceProvider
       .Tokenize(@` Value = ValidateEnumKeyword.Second`)
       .Count(3)
       .StringLiteral(0, `Value`)
       .Operator(1, OperatorType.Assignment)
       .MemberAccess(2, `ValidateEnumKeyword.Second`)
       .Assert();
   }

  it('XXXX', async () => {
   public testAssignmentWithDoubleMemberAccess(): void {
     ServiceProvider
       .TokenizeExpectError(@` Value = ValidateEnumKeyword..Second`)
       .ErrorMessage.ShouldContain(`Unexpected character: '.'. Member accessor should be followed by member name.`);
   }

  it('XXXX', async () => {
   public testAssignmentWithMemberAccessWithoutLastMember(): void {
     ServiceProvider
       .TokenizeExpectError(@` Value = ValidateEnumKeyword.`)
       .ErrorMessage.ShouldContain(`Invalid token at end of line. Unexpected end of line. Member accessor should be followed by member name.`);
   }
}
