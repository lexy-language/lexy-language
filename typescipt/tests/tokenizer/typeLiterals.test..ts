

export class TypeLiteralsTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public testIntTypeLiteral(): void {
     ServiceProvider
       .Tokenize(@` number Value`)
       .Count(2)
       .StringLiteral(0, `number`)
       .StringLiteral(1, `Value`)
       .Assert();
   }

  it('XXXX', async () => {
   public testNumberTypeLiteral(): void {
     ServiceProvider
       .Tokenize(@` number Value`)
       .Count(2)
       .StringLiteral(0, `number`)
       .StringLiteral(1, `Value`)
       .Assert();
   }

  it('XXXX', async () => {
   public testStringTypeLiteral(): void {
     ServiceProvider
       .Tokenize(@` string Value`)
       .Count(2)
       .StringLiteral(0, `string`)
       .StringLiteral(1, `Value`)
       .Assert();
   }

  it('XXXX', async () => {
   public testDateTimeTypeLiteral(): void {
     ServiceProvider
       .Tokenize(@` date Value`)
       .Count(2)
       .StringLiteral(0, `date`)
       .StringLiteral(1, `Value`)
       .Assert();
   }

  it('XXXX', async () => {
   public testBooleanTypeLiteral(): void {
     ServiceProvider
       .Tokenize(@` boolean Value`)
       .Count(2)
       .StringLiteral(0, `boolean`)
       .StringLiteral(1, `Value`)
       .Assert();
   }
}
