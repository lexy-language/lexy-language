

export class EnumDefinition extends RootNode {
   public EnumName Name

   public override string NodeName => Name.Value;

   public Array<EnumMember> Members = list<EnumMember>(): new;

   private EnumDefinition(string name, SourceReference reference) : base(reference) {
     Name = new EnumName(reference);
     Name.ParseName(name);
   }

   internal static parse(name: NodeName, reference: SourceReference): EnumDefinition {
     return new EnumDefinition(name.Name, reference);
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let lastIndex = Members.LastOrDefault()?.NumberValue ?? -1;
     let member = EnumMember.Parse(context, lastIndex);
     if (member != null) Members.Add(member);
     return this;
   }

   public override getChildren(): Array<INode> {
     yield return Name;

     foreach (let member in Members) yield return member;
   }

   protected override validate(context: IValidationContext): void {
     if (Members.Count == 0) {
       context.Logger.Fail(Reference, `Enum has no members defined.`);
       return;
     }

     DuplicateChecker.Validate(
       context,
       member => member.Reference,
       member => member.Name,
       member => $`Enum member name should be unique. Duplicate name: '{member.Name}'`,
       Members);
   }

   public containsMember(name: string): boolean {
     return Members.Any(member => member.Name == name);
   }
}
