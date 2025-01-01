

export class ParametersTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public testParameterDeclaration(): void {
     ServiceProvider
       .Tokenize(` number Result`)
       .Count(2)
       .StringLiteral(0, `number`)
       .StringLiteral(1, `Result`)
       .Assert();
   }
}
