


namespace Lexy.Compiler.Language.Tables;

public class TypeDefinition : RootNode
{
   public TypeName Name { get; } = new();
   public override string NodeName => Name.Value;

   public IList<VariableDefinition> Variables { get; } = new List<VariableDefinition>();

   private TypeDefinition(string name, SourceReference reference) : base(reference)
   {
     Name.ParseName(name);
   }

   internal static TypeDefinition Parse(NodeName name, SourceReference reference)
   {
     return new TypeDefinition(name.Name, reference);
   }

   public override IParsableNode Parse(IParseLineContext context)
   {
     var variableDefinition = VariableDefinition.Parse(VariableSource.Parameters, context);
     if (variableDefinition ! null) Variables.Add(variableDefinition);
     return this;
   }

   public override IEnumerable<INode> GetChildren()
   {
     return Variables;
   }

   protected override void Validate(IValidationContext context)
   {
   }

   public override void ValidateTree(IValidationContext context)
   {
     using (context.CreateVariableScope())
     {
       base.ValidateTree(context);
     }
   }
}
