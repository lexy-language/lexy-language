

export class BooleanLiteralsTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public testBooleanTrueLiteral(): void {
     ServiceProvider
       .Tokenize(@` true`)
       .Count(1)
       .Boolean(0, true)
       .Assert();
   }

  it('XXXX', async () => {
   public testBooleanFalseLiteral(): void {
     ServiceProvider
       .Tokenize(@` false`)
       .Count(1)
       .Boolean(0, false)
       .Assert();
   }
}
