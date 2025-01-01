

export class StringLiteralsTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public testQuotedLiteral(): void {
     ServiceProvider
       .Tokenize(@` ``This is a quoted literal```)
       .Count(1)
       .QuotedString(0, `This is a quoted literal`)
       .Assert();
   }

  it('XXXX', async () => {
   public testStringLiteral(): void {
     ServiceProvider
       .Tokenize(@` ThisIsAStringLiteral`)
       .Count(1)
       .StringLiteral(0, `ThisIsAStringLiteral`)
       .Assert();
   }
}
