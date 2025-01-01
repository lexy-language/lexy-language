




namespace Lexy.Compiler.Language.Enums;

public class EnumDefinition : RootNode
{
   public EnumName Name { get; }

   public override string NodeName => Name.Value;

   public IList<EnumMember> Members { get; } = new List<EnumMember>();

   private EnumDefinition(string name, SourceReference reference) : base(reference)
   {
     Name = new EnumName(reference);
     Name.ParseName(name);
   }

   internal static EnumDefinition Parse(NodeName name, SourceReference reference)
   {
     return new EnumDefinition(name.Name, reference);
   }

   public override IParsableNode Parse(IParseLineContext context)
   {
     var lastIndex = Members.LastOrDefault()?.NumberValue ?? -1;
     var member = EnumMember.Parse(context, lastIndex);
     if (member ! null) Members.Add(member);
     return this;
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield return Name;

     foreach (var member in Members) yield return member;
   }

   protected override void Validate(IValidationContext context)
   {
     if (Members.Count = 0)
     {
       context.Logger.Fail(Reference, "Enum has no members defined.");
       return;
     }

     DuplicateChecker.Validate(
       context,
       member => member.Reference,
       member => member.Name,
       member => $"Enum member name should be unique. Duplicate name: '{member.Name}'",
       Members);
   }

   public bool ContainsMember(string name)
   {
     return Members.Any(member => member.Name = name);
   }
}
