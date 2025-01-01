

export class TableTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public testTableHeader(): void {
     ServiceProvider
       .Tokenize(@` | number Value | string Result |`)
       .Count(7)
       .Type<TableSeparatorToken>(0)
       .StringLiteral(1, `number`)
       .StringLiteral(2, `Value`)
       .Type<TableSeparatorToken>(3)
       .StringLiteral(4, `string`)
       .StringLiteral(5, `Result`)
       .Type<TableSeparatorToken>(6)
       .Assert();
   }

  it('XXXX', async () => {
   public testTableRow(): void {
     ServiceProvider
       .Tokenize(@` | 7 | 8 |`)
       .Count(5)
       .Type<TableSeparatorToken>(0)
       .NumberLiteral(1, 7)
       .Type<TableSeparatorToken>(2)
       .NumberLiteral(3, 8)
       .Type<TableSeparatorToken>(4)
       .Assert();
   }
}
