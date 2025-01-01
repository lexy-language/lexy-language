

export class ParseEnumTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public simpleEnum(): void {
     let code = `Enum: Enum1
  First
  Second`;

     let parser = ServiceProvider.GetRequiredService<ILexyParser>();
     let enumValue = parser.ParseEnum(code);

     enumValue.Name.Value.ShouldBe(`Enum1`);
     enumValue.Members.Count.ShouldBe(2);
     enumValue.Members[0].Name.ShouldBe(`First`);
     enumValue.Members[0].NumberValue.ShouldBe(0);
     enumValue.Members[0].ValueLiteral.ShouldBeNull();
     enumValue.Members[1].Name.ShouldBe(`Second`);
     enumValue.Members[1].NumberValue.ShouldBe(1);
     enumValue.Members[1].ValueLiteral.ShouldBeNull();
   }

  it('XXXX', async () => {
   public enumWithValues(): void {
     let code = `Enum: Enum2
  First = 5
  Second = 6`;

     let parser = ServiceProvider.GetRequiredService<ILexyParser>();
     let enumValue = parser.ParseEnum(code);

     enumValue.Name.Value.ShouldBe(`Enum2`);
     enumValue.Members.Count.ShouldBe(2);
     enumValue.Members[0].Name.ShouldBe(`First`);
     enumValue.Members[0].NumberValue.ShouldBe(5);
     enumValue.Members[0].ValueLiteral.NumberValue.ShouldBe(5);
     enumValue.Members[1].Name.ShouldBe(`Second`);
     enumValue.Members[1].NumberValue.ShouldBe(6);
     enumValue.Members[1].ValueLiteral.NumberValue.ShouldBe(6m);
   }
}
