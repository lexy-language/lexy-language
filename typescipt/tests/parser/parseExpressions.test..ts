

export class ParseExpressionsTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public testInAndStringColumns(): void {
     let code = `Table: TestTable
  | number Value | string Result |
  | 7 | "Test quoted" |
  | 8 | "Test" |`;

     let parser = ServiceProvider.GetRequiredService<ILexyParser>();
     let script = parser.ParseTable(code);

     let context = GetService<IParserContext>();
     context.logger.HasErrors().ShouldBeFalse(context.logger.FormatMessages());

     script.Name.Value.ShouldBe(`TestTable`);
     script.Header.Columns.Count.ShouldBe(2);
     script.Header.Columns[0].Name.ShouldBe(`Value`);
     script.Header.Columns[0].Type.ShouldBePrimitiveType(TypeNames.Number);
     script.Header.Columns[1].Name.ShouldBe(`Result`);
     script.Header.Columns[1].Type.ShouldBePrimitiveType(TypeNames.String);
     script.Rows.Count.ShouldBe(2);
     script.Rows[0].Values[0].ValidateNumericLiteralExpression(7);
     script.Rows[0].Values[1].ValidateQuotedLiteralExpression(`Test quoted`);
     script.Rows[1].Values[0].ValidateNumericLiteralExpression(8);
     script.Rows[1].Values[1].ValidateQuotedLiteralExpression(`Test`);
   }

  it('XXXX', async () => {
   public testDateTimeAndBoolean(): void {
     let code = `Table: TestTable
  | date Value | boolean Result |
  | d"2024-12-18T17:07:45" | false |
  | d"2024-12-18T17:08:12" | true |`;

     let parser = ServiceProvider.GetRequiredService<ILexyParser>();
     let script = parser.ParseTable(code);

     script.Name.Value.ShouldBe(`TestTable`);
     script.Header.Columns.Count.ShouldBe(2);
     script.Header.Columns[0].Name.ShouldBe(`Value`);
     script.Header.Columns[0].Type.ShouldBePrimitiveType(TypeNames.Date);
     script.Header.Columns[1].Name.ShouldBe(`Result`);
     script.Header.Columns[1].Type.ShouldBePrimitiveType(TypeNames.Boolean);
     script.Rows.Count.ShouldBe(2);
     script.Rows[0].Values[0].ValidateDateTimeLiteralExpression(`2024-12-18T17:07:45`);
     script.Rows[0].Values[1].ValidateBooleanLiteralExpression(false);
     script.Rows[1].Values[0].ValidateDateTimeLiteralExpression(`2024-12-18T17:08:12`);
     script.Rows[1].Values[1].ValidateBooleanLiteralExpression(true);
   }
}
