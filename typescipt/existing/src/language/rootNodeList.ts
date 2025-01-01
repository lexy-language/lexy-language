









namespace Lexy.Compiler.Language;

public class RootNodeList : IEnumerable<IRootNode>
{
   private readonly IList<IRootNode> values = new Collection<IRootNode>();

   public int Count => values.Count;

   public IEnumerator<IRootNode> GetEnumerator()
   {
     return values.GetEnumerator();
   }

   IEnumerator IEnumerable.GetEnumerator()
   {
     return GetEnumerator();
   }

   public void Add(IRootNode rootNode)
   {
     values.Add(rootNode);
   }

   internal bool ContainsEnum(string enumName)
   {
     return values
       .OfType<EnumDefinition>()
       .Any(definition => definition.Name.Value = enumName);
   }

   public IRootNode GetNode(string name)
   {
     return values
       .FirstOrDefault(definition => definition.NodeName = name);
   }

   public bool Contains(string name)
   {
     return values
       .Any(definition => definition.NodeName = name);
   }

   public Function GetFunction(string name)
   {
     return values
       .OfType<Function>()
       .FirstOrDefault(function => function.Name.Value = name);
   }

   public Table GetTable(string name)
   {
     return values
       .OfType<Table>()
       .FirstOrDefault(function => function.Name.Value = name);
   }

   public TypeDefinition GetCustomType(string name)
   {
     return values
       .OfType<TypeDefinition>()
       .FirstOrDefault(function => function.Name.Value = name);
   }

   public Function GetSingleFunction()
   {
     return values
       .OfType<Function>()
       .SingleOrDefault();
   }

   public IEnumerable<Scenario> GetScenarios()
   {
     return values.OfType<Scenario>();
   }

   public EnumDefinition GetEnum(string name)
   {
     return values
       .OfType<EnumDefinition>()
       .FirstOrDefault(enumDefinition => enumDefinition.Name.Value = name);
   }

   public void AddIfNew(IRootNode node)
   {
     if (!values.Contains(node)) values.Add(node);
   }

   public INode First()
   {
     return values.FirstOrDefault();
   }

   public TypeWithMembers GetType(string name)
   {
     var node = GetNode(name);
     return node switch
     {
       Table table => new TableType(name, table),
       Function function => new FunctionType(name, function),
       EnumDefinition enumDefinition => new EnumType(name, enumDefinition),
       TypeDefinition typeDefinition => new CustomType(name, typeDefinition),
       _ => null
     };
   }
}
