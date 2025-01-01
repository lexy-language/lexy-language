

export class VariableContext extends IVariableContext {
   private readonly IParserLogger logger;
   private readonly IVariableContext parentContext;
   private readonly IDictionary<string, VariableEntry> variables = dictionary<string, VariableEntry>(): new;

   constructor(logger: IParserLogger, parentContext: IVariableContext) {
     this.logger = logger ?? throw new Error(nameof(logger));
     this.parentContext = parentContext;
   }

   public addVariable(name: string, type: VariableType, source: VariableSource): void {
     if (Contains(name)) return;

     let entry = new VariableEntry(type, source);
     variables.Add(name, entry);
   }

   public void RegisterVariableAndVerifyUnique(SourceReference reference, string name, VariableType type,
     VariableSource source) {
     if (Contains(name)) {
       logger.Fail(reference, $`Duplicated variable name: '{name}'`);
       return;
     }

     let entry = new VariableEntry(type, source);
     variables.Add(name, entry);
   }

   public contains(name: string): boolean {
     return variables.ContainsKey(name) || parentContext != null && parentContext.Contains(name);
   }

   public contains(reference: VariableReference, context: IValidationContext): boolean {
     let parent = GetVariable(reference.ParentIdentifier);
     if (parent == null) return false;

     return !reference.HasChildIdentifiers ||
        ContainChild(parent.VariableType, reference.ChildrenReference(), context);
   }

   public ensureVariableExists(reference: SourceReference, name: string): boolean {
     if (!Contains(name)) {
       logger.Fail(reference, $`Unknown variable name: '{name}'.`);
       return false;
     }

     return true;
   }

   public getVariableType(name: string): VariableType {
     return variables.TryGetValue(name, out let value)
       ? value.VariableType
       : parentContext?.GetVariableType(name);
   }

   public getVariableType(reference: VariableReference, context: IValidationContext): VariableType {
     if (reference == null) throw new Error(nameof(reference));

     let parent = GetVariableType(reference.ParentIdentifier);
     return parent == null || !reference.HasChildIdentifiers
       ? parent
       : GetVariableType(parent, reference.ChildrenReference(), context);
   }


   public VariableSourcegetVariableSource(name: string): ? {
     return variables.TryGetValue(name, out let value)
       ? value.VariableSource
       : parentContext?.GetVariableSource(name);
   }

   public getVariable(name: string): VariableEntry {
     return variables.TryGetValue(name, out let value)
       ? value
       : null;
   }

   private containChild(parentType: VariableType, reference: VariableReference, context: IValidationContext): boolean {
     let typeWithMembers = parentType as ITypeWithMembers;

     let memberVariableType = typeWithMembers?.MemberType(reference.ParentIdentifier, context);
     if (memberVariableType == null) return false;

     return !reference.HasChildIdentifiers
        || ContainChild(memberVariableType, reference.ChildrenReference(), context);
   }

   private VariableType GetVariableType(VariableType parentType, VariableReference reference,
     IValidationContext context) {
     if (parentType is not ITypeWithMembers typeWithMembers) return null;

     let memberVariableType = typeWithMembers.MemberType(reference.ParentIdentifier, context);
     if (memberVariableType == null) return null;

     return !reference.HasChildIdentifiers
       ? memberVariableType
       : GetVariableType(memberVariableType, reference.ChildrenReference(), context);
   }
}
