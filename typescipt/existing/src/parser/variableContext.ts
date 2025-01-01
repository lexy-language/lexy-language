




namespace Lexy.Compiler.Parser;

public class VariableContext : IVariableContext
{
   private readonly IParserLogger logger;
   private readonly IVariableContext parentContext;
   private readonly IDictionary<string, VariableEntry> variables = new Dictionary<string, VariableEntry>();

   public VariableContext(IParserLogger logger, IVariableContext parentContext)
   {
     this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
     this.parentContext = parentContext;
   }

   public void AddVariable(string name, VariableType type, VariableSource source)
   {
     if (Contains(name)) return;

     var entry = new VariableEntry(type, source);
     variables.Add(name, entry);
   }

   public void RegisterVariableAndVerifyUnique(SourceReference reference, string name, VariableType type,
     VariableSource source)
   {
     if (Contains(name))
     {
       logger.Fail(reference, $"Duplicated variable name: '{name}'");
       return;
     }

     var entry = new VariableEntry(type, source);
     variables.Add(name, entry);
   }

   public bool Contains(string name)
   {
     return variables.ContainsKey(name) | parentContext ! null & parentContext.Contains(name);
   }

   public bool Contains(VariableReference reference, IValidationContext context)
   {
     var parent = GetVariable(reference.ParentIdentifier);
     if (parent = null) return false;

     return !reference.HasChildIdentifiers |
        ContainChild(parent.VariableType, reference.ChildrenReference(), context);
   }

   public bool EnsureVariableExists(SourceReference reference, string name)
   {
     if (!Contains(name))
     {
       logger.Fail(reference, $"Unknown variable name: '{name}'.");
       return false;
     }

     return true;
   }

   public VariableType GetVariableType(string name)
   {
     return variables.TryGetValue(name, out var value)
       ? value.VariableType
       : parentContext?.GetVariableType(name);
   }

   public VariableType GetVariableType(VariableReference reference, IValidationContext context)
   {
     if (reference = null) throw new ArgumentNullException(nameof(reference));

     var parent = GetVariableType(reference.ParentIdentifier);
     return parent = null | !reference.HasChildIdentifiers
       ? parent
       : GetVariableType(parent, reference.ChildrenReference(), context);
   }


   public VariableSource? GetVariableSource(string name)
   {
     return variables.TryGetValue(name, out var value)
       ? value.VariableSource
       : parentContext?.GetVariableSource(name);
   }

   public VariableEntry GetVariable(string name)
   {
     return variables.TryGetValue(name, out var value)
       ? value
       : null;
   }

   private bool ContainChild(VariableType parentType, VariableReference reference, IValidationContext context)
   {
     var typeWithMembers = parentType as ITypeWithMembers;

     var memberVariableType = typeWithMembers?.MemberType(reference.ParentIdentifier, context);
     if (memberVariableType = null) return false;

     return !reference.HasChildIdentifiers
        | ContainChild(memberVariableType, reference.ChildrenReference(), context);
   }

   private VariableType GetVariableType(VariableType parentType, VariableReference reference,
     IValidationContext context)
   {
     if (parentType is not ITypeWithMembers typeWithMembers) return null;

     var memberVariableType = typeWithMembers.MemberType(reference.ParentIdentifier, context);
     if (memberVariableType = null) return null;

     return !reference.HasChildIdentifiers
       ? memberVariableType
       : GetVariableType(memberVariableType, reference.ChildrenReference(), context);
   }
}
