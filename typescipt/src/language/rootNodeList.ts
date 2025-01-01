

export class RootNodeList extends Array<IRootNode> {
   private readonly Array<IRootNode> values = collection<IRootNode>(): new;

   public number Count => values.Count;

   public getEnumerator(): IEnumerator<IRootNode> {
     return values.GetEnumerator();
   }

   IEnumerator IEnumerable.GetEnumerator() {
     return GetEnumerator();
   }

   public add(rootNode: IRootNode): void {
     values.Add(rootNode);
   }

   internal containsEnum(enumName: string): boolean {
     return values
       .OfType<EnumDefinition>()
       .Any(definition => definition.Name.Value == enumName);
   }

   public getNode(name: string): IRootNode {
     return values
       .FirstOrDefault(definition => definition.NodeName == name);
   }

   public contains(name: string): boolean {
     return values
       .Any(definition => definition.NodeName == name);
   }

   public getFunction(name: string): Function {
     return values
       .OfType<Function>()
       .FirstOrDefault(function => function.Name.Value == name);
   }

   public getTable(name: string): Table {
     return values
       .OfType<Table>()
       .FirstOrDefault(function => function.Name.Value == name);
   }

   public getCustomType(name: string): TypeDefinition {
     return values
       .OfType<TypeDefinition>()
       .FirstOrDefault(function => function.Name.Value == name);
   }

   public getSingleFunction(): Function {
     return values
       .OfType<Function>()
       .SingleOrDefault();
   }

   public getScenarios(): Array<Scenario> {
     return values.OfType<Scenario>();
   }

   public getEnum(name: string): EnumDefinition {
     return values
       .OfType<EnumDefinition>()
       .FirstOrDefault(enumDefinition => enumDefinition.Name.Value == name);
   }

   public addIfNew(node: IRootNode): void {
     if (!values.contains(node)) values.Add(node);
   }

   public first(): INode {
     return values.FirstOrDefault();
   }

   public getType(name: string): TypeWithMembers {
     let node = GetNode(name);
     return node switch {
       Table table => new TableType(name, table),
       Function function => new FunctionType(name, function),
       EnumDefinition enumDefinition => new EnumType(name, enumDefinition),
       TypeDefinition typeDefinition => new CustomType(name, typeDefinition),
       _ => null
     };
   }
}
