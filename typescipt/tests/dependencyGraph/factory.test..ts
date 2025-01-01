

export class FactoryTests extends ScopedServicesTestFixture {
   private const string enumDefinition = `Enum: SimpleEnum
  First
  Second
`;

   private const string table = `Table: SimpleTable
  | number Search | string Value |
  | 0 | "0" |
  | 1 | "1" |
  | 2 | "2" |
`;

   private const string function = `Function: SimpleFunction
  Parameters
   number Value
  Results
   number Result
  Code
   Result = Value
`;

  it('XXXX', async () => {
   public simpleEnum(): void {
     let dependencies = ServiceProvider.BuildGraph(enumDefinition);
     dependencies.Nodes.Count.ShouldBe(1);
     dependencies.Nodes[0].Name.ShouldBe(`SimpleEnum`);
     dependencies.Nodes[0].Type.ShouldBe(typeof(EnumDefinition));
     dependencies.Nodes[0].Dependencies.Count.ShouldBe(0);
   }

  it('XXXX', async () => {
   public simpleTable(): void {
     let dependencies = ServiceProvider.BuildGraph(table);
     dependencies.Nodes.Count.ShouldBe(1);
     dependencies.Nodes[0].Name.ShouldBe(`SimpleTable`);
     dependencies.Nodes[0].Type.ShouldBe(typeof(Table));
     dependencies.Nodes[0].Dependencies.Count.ShouldBe(0);
   }

  it('XXXX', async () => {
   public simpleFunction(): void {
     let dependencies = ServiceProvider.BuildGraph(function);
     dependencies.Nodes.Count.ShouldBe(1);
     dependencies.Nodes[0].Name.ShouldBe(`SimpleFunction`);
     dependencies.Nodes[0].Type.ShouldBe(typeof(Function));
     dependencies.Nodes[0].Dependencies.Count.ShouldBe(0);
   }

  it('XXXX', async () => {
   public functionNewFunctionParameters(): void {
     let dependencies = ServiceProvider.BuildGraph(function + `
Function: Caller
  Code
   let parameters = new(SimpleFunction.Parameters)
`);

     dependencies.Nodes.Count.ShouldBe(2);
     dependencies.Nodes[0].Name.ShouldBe(`SimpleFunction`);
     dependencies.Nodes[0].Type.ShouldBe(typeof(Function));
     dependencies.Nodes[0].Dependencies.Count.ShouldBe(0);
     dependencies.Nodes[1].Name.ShouldBe(`Caller`);
     dependencies.Nodes[1].Type.ShouldBe(typeof(Function));
     dependencies.Nodes[1].Dependencies.Count.ShouldBe(1);
     dependencies.Nodes[1].Dependencies[0].Name.ShouldBe(`SimpleFunction`);
     dependencies.Nodes[1].Dependencies[0].Type.ShouldBe(typeof(Function));
   }

  it('XXXX', async () => {
   public functionNewFunctionResults(): void {
     let dependencies = ServiceProvider.BuildGraph(function + `
Function: Caller
  Code
   let parameters = new(SimpleFunction.results)
`);

     dependencies.Nodes.Count.ShouldBe(2);
     dependencies.Nodes[0].Name.ShouldBe(`SimpleFunction`);
     dependencies.Nodes[0].Type.ShouldBe(typeof(Function));
     dependencies.Nodes[0].Dependencies.Count.ShouldBe(0);
     dependencies.Nodes[1].Name.ShouldBe(`Caller`);
     dependencies.Nodes[1].Type.ShouldBe(typeof(Function));
     dependencies.Nodes[1].Dependencies.Count.ShouldBe(1);
     dependencies.Nodes[1].Dependencies[0].Name.ShouldBe(`SimpleFunction`);
     dependencies.Nodes[1].Dependencies[0].Type.ShouldBe(typeof(Function));
   }

  it('XXXX', async () => {
   public functionFillFunctionParameters(): void {
     let dependencies = ServiceProvider.BuildGraph(function + `
Function: Caller
  Parameters
   number Value
  Code
   let parameters = fill(SimpleFunction.Parameters)
`);

     dependencies.Nodes.Count.ShouldBe(2);
     dependencies.Nodes[0].Name.ShouldBe(`SimpleFunction`);
     dependencies.Nodes[0].Type.ShouldBe(typeof(Function));
     dependencies.Nodes[0].Dependencies.Count.ShouldBe(0);
     dependencies.Nodes[1].Name.ShouldBe(`Caller`);
     dependencies.Nodes[1].Type.ShouldBe(typeof(Function));
     dependencies.Nodes[1].Dependencies.Count.ShouldBe(1);
     dependencies.Nodes[1].Dependencies[0].Name.ShouldBe(`SimpleFunction`);
     dependencies.Nodes[1].Dependencies[0].Type.ShouldBe(typeof(Function));
   }

  it('XXXX', async () => {
   public functionFillFunctionResults(): void {
     let dependencies = ServiceProvider.BuildGraph(function + `
Function: Caller
  Parameters
   number Result
  Code
   let parameters = fill(SimpleFunction.results)
`);

     dependencies.Nodes.Count.ShouldBe(2);
     dependencies.Nodes[0].Name.ShouldBe(`SimpleFunction`);
     dependencies.Nodes[0].Type.ShouldBe(typeof(Function));
     dependencies.Nodes[0].Dependencies.Count.ShouldBe(0);
     dependencies.Nodes[1].Name.ShouldBe(`Caller`);
     dependencies.Nodes[1].Type.ShouldBe(typeof(Function));
     dependencies.Nodes[1].Dependencies.Count.ShouldBe(1);
     dependencies.Nodes[1].Dependencies[0].Name.ShouldBe(`SimpleFunction`);
     dependencies.Nodes[1].Dependencies[0].Type.ShouldBe(typeof(Function));
   }

  it('XXXX', async () => {
   public tableLookup(): void {
     let dependencies = ServiceProvider.BuildGraph(table + `
Function: Caller
  Code
   let result = LOOKUP(SimpleTable, 2, SimpleTable.Search, SimpleTable.Value)
`);

     dependencies.Nodes.Count.ShouldBe(2);
     dependencies.Nodes[0].Name.ShouldBe(`SimpleTable`);
     dependencies.Nodes[0].Type.ShouldBe(typeof(Table));
     dependencies.Nodes[0].Dependencies.Count.ShouldBe(0);
     dependencies.Nodes[1].Name.ShouldBe(`Caller`);
     dependencies.Nodes[1].Type.ShouldBe(typeof(Function));
     dependencies.Nodes[1].Dependencies.Count.ShouldBe(1);
     dependencies.Nodes[1].Dependencies[0].Name.ShouldBe(`SimpleTable`);
     dependencies.Nodes[1].Dependencies[0].Type.ShouldBe(typeof(Table));
   }

  it('XXXX', async () => {
   public simpleScenario(): void {
     let dependencies = ServiceProvider.BuildGraph(function + `

Scenario: Simple
  Function SimpleFunction
  Results
   Result = 2
  Parameters
   Value = 2
`);
     dependencies.Nodes.Count.ShouldBe(2);
     dependencies.Nodes[0].Name.ShouldBe(`SimpleFunction`);
     dependencies.Nodes[0].Type.ShouldBe(typeof(Function));
     dependencies.Nodes[0].Dependencies.Count.ShouldBe(0);
     dependencies.Nodes[1].Name.ShouldBe(`Simple`);
     dependencies.Nodes[1].Type.ShouldBe(typeof(Scenario));
     dependencies.Nodes[1].Dependencies.Count.ShouldBe(0);
   }

  it('XXXX', async () => {
   public simpleType(): void {
     let dependencies = ServiceProvider.BuildGraph(`
Type: Simple
  number Value1
  string Value2
`);
     dependencies.Nodes.Count.ShouldBe(1);
     dependencies.Nodes[0].Name.ShouldBe(`Simple`);
     dependencies.Nodes[0].Type.ShouldBe(typeof(TypeDefinition));
     dependencies.Nodes[0].Dependencies.Count.ShouldBe(0);
   }

  it('XXXX', async () => {
   public complexType(): void {
     let dependencies = ServiceProvider.BuildGraph(`
Type: Inner
  number Value1
  string Value2

Type: Parent
  number Value1
  string Value2
  Inner Value3
`);
     dependencies.Nodes.Count.ShouldBe(2);
     dependencies.Nodes[0].Name.ShouldBe(`Inner`);
     dependencies.Nodes[0].Type.ShouldBe(typeof(TypeDefinition));
     dependencies.Nodes[0].Dependencies.Count.ShouldBe(0);
     dependencies.Nodes[1].Name.ShouldBe(`Parent`);
     dependencies.Nodes[1].Type.ShouldBe(typeof(TypeDefinition));
     dependencies.Nodes[1].Dependencies.Count.ShouldBe(1);
   }

  it('XXXX', async () => {
   public circularType(): void {
     let dependencies = ServiceProvider.BuildGraph(`
Type: Inner
  number Value1
  string Value2
  Parent Value3

Type: Parent
  number Value1
  string Value2
  Inner Value3
`, false);
     dependencies.Nodes.Count.ShouldBe(2);
     dependencies.Nodes[0].Name.ShouldBe(`Inner`);
     dependencies.Nodes[0].Type.ShouldBe(typeof(TypeDefinition));
     dependencies.Nodes[0].Dependencies.Count.ShouldBe(1);
     dependencies.Nodes[1].Name.ShouldBe(`Parent`);
     dependencies.Nodes[1].Type.ShouldBe(typeof(TypeDefinition));
     dependencies.Nodes[1].Dependencies.Count.ShouldBe(1);
     dependencies.CircularReferences.Count().ShouldBe(2);
     dependencies.CircularReferences[0].NodeName.ShouldBe(`Inner`);
     dependencies.CircularReferences[1].NodeName.ShouldBe(`Parent`);
   }

  it('XXXX', async () => {
   public circularFunctionCall(): void {
     let dependencies = ServiceProvider.BuildGraph(`
Function: Inner
  Code
   Parent()

Function: Parent
  Code
   Inner()
`, false);

     dependencies.Nodes.Count.ShouldBe(2);
     dependencies.Nodes[0].Name.ShouldBe(`Inner`);
     dependencies.Nodes[0].Type.ShouldBe(typeof(Function));
     dependencies.Nodes[0].Dependencies.Count.ShouldBe(1);
     dependencies.Nodes[1].Name.ShouldBe(`Parent`);
     dependencies.Nodes[1].Type.ShouldBe(typeof(Function));
     dependencies.Nodes[1].Dependencies.Count.ShouldBe(1);
     dependencies.CircularReferences.Count().ShouldBe(2);
     dependencies.CircularReferences[0].NodeName.ShouldBe(`Inner`);
     dependencies.CircularReferences[1].NodeName.ShouldBe(`Parent`);
   }
}
