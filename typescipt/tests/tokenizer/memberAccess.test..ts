

export class MemberAccessTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public testTableHeader(): void {
     ServiceProvider
       .Tokenize(@` Source.Member`)
       .Count(1)
       .Type<MemberAccessLiteral>(0)
       .MemberAccess(0, `Source.Member`)
       .Assert();
   }
}
