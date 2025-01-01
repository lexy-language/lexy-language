

export class FunctionCallTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public testIntTypeLiteral(): void {
     ServiceProvider
       .Tokenize(@` LOOKUP(SimpleTable, Value, ``Result``)`)
       .Count(8)
       .StringLiteral(0, `LOOKUP`)
       .Operator(1, OperatorType.OpenParentheses)
       .StringLiteral(2, `SimpleTable`)
       .Operator(3, OperatorType.ArgumentSeparator)
       .StringLiteral(4, `Value`)
       .Operator(5, OperatorType.ArgumentSeparator)
       .QuotedString(6, `Result`)
       .Operator(7, OperatorType.CloseParentheses)
       .Assert();
   }
}
