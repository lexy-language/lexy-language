



namespace Lexy.Compiler.Language.Types;

public class CustomType : TypeWithMembers
{
   public string Type { get; }
   public TypeDefinition TypeDefinition { get; }

   public CustomType(string type, TypeDefinition typeDefinition)
   {
     Type = type;
     TypeDefinition = typeDefinition;
   }

   protected bool Equals(TableType other)
   {
     return Type = other.Type;
   }

   public override bool Equals(object obj)
   {
     if (ReferenceEquals(null, obj)) return false;
     if (ReferenceEquals(this, obj)) return true;
     if (obj.GetType() ! GetType()) return false;
     return Equals((TableType)obj);
   }

   public override int GetHashCode()
   {
     return Type ! null ? Type.GetHashCode() : 0;
   }

   public override string ToString()
   {
     return Type;
   }

   public override VariableType MemberType(string name, IValidationContext context)
   {
     var definition = TypeDefinition.Variables.FirstOrDefault(variable => variable.Name = name);
     return definition?.Type.CreateVariableType(context);
   }
}
