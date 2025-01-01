

export class TokensListTests {
  it('XXXX', async () => {
   public tokensFrom(): void {
     let list = new TokenList(new[] {
       TokenFactory.String(`123`),
       TokenFactory.String(`456`),
       TokenFactory.String(`789`)
     });

     let result = list.TokensFrom(1);
     result.Length.ShouldBe(2);
     result[0].ValidateStringLiteralToken(`456`);
     result[1].ValidateStringLiteralToken(`789`);
   }

  it('XXXX', async () => {
   public tokensStart(): void {
     let list = new TokenList(new[] {
       TokenFactory.String(`123`),
       TokenFactory.String(`456`),
       TokenFactory.String(`789`)
     });

     let result = list.TokensFromStart(2);
     result.Length.ShouldBe(2);
     result[0].ValidateStringLiteralToken(`123`);
     result[1].ValidateStringLiteralToken(`456`);
   }

  it('XXXX', async () => {
   public tokensRange(): void {
     let list = new TokenList(new[] {
       TokenFactory.String(`1111`),
       TokenFactory.String(`2222`),
       TokenFactory.String(`3333`),
       TokenFactory.String(`4444`),
       TokenFactory.String(`5555`)
     });

     let result = list.TokensRange(1, 3);
     result.Length.ShouldBe(3);
     result[0].ValidateStringLiteralToken(`2222`);
     result[1].ValidateStringLiteralToken(`3333`);
     result[2].ValidateStringLiteralToken(`4444`);
   }
}
