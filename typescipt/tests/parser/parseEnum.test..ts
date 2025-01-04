

export class ParseEnumTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public simpleEnum(): void {
     let code = `Enum: Enum1
  First
  Second`;

     let parser = ServiceProvider.GetRequiredService<ILexyParser>();
     let enumValue = parser.ParseEnum(code);

     enumValue.Name.Value.toBe(`Enum1`);
     enumValue.Members.Count.toBe(2);
     enumValue.Members[0].Name.toBe(`First`);
     enumValue.Members[0].NumberValue.toBe(0);
     enumValue.Members[0].ValueLiteral.toBeNull();
     enumValue.Members[1].Name.toBe(`Second`);
     enumValue.Members[1].NumberValue.toBe(1);
     enumValue.Members[1].ValueLiteral.toBeNull();
   }

  it('XXXX', async () => {
   public enumWithValues(): void {
     let code = `Enum: Enum2
  First = 5
  Second = 6`;

     let parser = ServiceProvider.GetRequiredService<ILexyParser>();
     let enumValue = parser.ParseEnum(code);

     enumValue.Name.Value.toBe(`Enum2`);
     enumValue.Members.Count.toBe(2);
     enumValue.Members[0].Name.toBe(`First`);
     enumValue.Members[0].NumberValue.toBe(5);
     enumValue.Members[0].ValueLiteral.NumberValue.toBe(5);
     enumValue.Members[1].Name.toBe(`Second`);
     enumValue.Members[1].NumberValue.toBe(6);
     enumValue.Members[1].ValueLiteral.NumberValue.toBe(6m);
   }
}
