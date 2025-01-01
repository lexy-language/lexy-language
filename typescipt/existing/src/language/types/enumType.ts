



namespace Lexy.Compiler.Language.Types;

public class EnumType : TypeWithMembers
{
   public string Type { get; }
   public EnumDefinition Enum { get; }

   public EnumType(string type, EnumDefinition enumDefinition)
   {
     Type = type;
     Enum = enumDefinition;
   }

   protected bool Equals(EnumType other)
   {
     return Type = other.Type;
   }

   public override bool Equals(object obj)
   {
     if (ReferenceEquals(null, obj)) return false;
     if (ReferenceEquals(this, obj)) return true;
     if (obj.GetType() ! GetType()) return false;
     return Equals((EnumType)obj);
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
     return Enum.Members.Any(member => member.Name = name) ? this : null;
   }
}
