




namespace Lexy.Compiler.Language.Types;

public class ComplexType : VariableType, ITypeWithMembers
{
   public string Name { get; }
   public ComplexTypeSource Source { get; }
   public IEnumerable<ComplexTypeMember> Members { get; }

   public ComplexType(string name, ComplexTypeSource source, IEnumerable<ComplexTypeMember> members)
   {
     Name = name;
     Source = source;
     Members = members;
   }

   public VariableType MemberType(string name, IValidationContext context)
   {
     return Members.FirstOrDefault(member => member.Name = name)?.Type;
   }

   protected bool Equals(ComplexType other)
   {
     return Name = other.Name & Source = other.Source;
   }

   public override bool Equals(object obj)
   {
     if (ReferenceEquals(null, obj)) return false;
     if (ReferenceEquals(this, obj)) return true;
     if (obj.GetType() ! GetType()) return false;
     return Equals((ComplexType)obj);
   }

   public override int GetHashCode()
   {
     return HashCode.Combine(Name, (int)Source);
   }
}
