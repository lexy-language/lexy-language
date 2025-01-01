

export class NumberLiteralsTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public intLiteral(): void {
     ServiceProvider
       .Tokenize(@` 0`)
       .Count(1)
       .NumberLiteral(0, 0)
       .Assert();
   }

  it('XXXX', async () => {
   public int3CharLiteral(): void {
     ServiceProvider
       .Tokenize(@` 456`)
       .Count(1)
       .NumberLiteral(0, 456)
       .Assert();
   }


  it('XXXX', async () => {
   public negativeIntLiteral(): void {
     ServiceProvider
       .Tokenize(@` -456`)
       .Count(2)
       .Operator(0, OperatorType.Subtraction)
       .NumberLiteral(1, 456)
       .Assert();
   }

  it('XXXX', async () => {
   public decimalLiteral(): void {
     ServiceProvider
       .Tokenize(@` 456.78`)
       .Count(1)
       .NumberLiteral(0, 456.78m)
       .Assert();
   }

  it('XXXX', async () => {
   public negativeDecimalLiteral(): void {
     ServiceProvider
       .Tokenize(@` -456.78`)
       .Count(2)
       .Operator(0, OperatorType.Subtraction)
       .NumberLiteral(1, 456.78m)
       .Assert();
   }

  it('XXXX', async () => {
   public invalidDecimalSubtract(): void {
     ServiceProvider
       .Tokenize(@` 456-78`)
       .Count(3)
       .NumberLiteral(0, 456)
       .Operator(1, OperatorType.Subtraction)
       .NumberLiteral(2, 78m)
       .Assert();
   }

  it('XXXX', async () => {
   public invalidDecimalLiteral(): void {
     ServiceProvider
       .TokenizeExpectError(@` 456d78`)
       .ErrorMessage.ShouldContain(`Invalid number token character: 'd'`);
   }

  it('XXXX', async () => {
   public invalidDecimalOpenParLiteral(): void {
     ServiceProvider
       .TokenizeExpectError(@` 456(78`)
       .ErrorMessage.ShouldContain(`Invalid number token character: '('`);
   }
}
