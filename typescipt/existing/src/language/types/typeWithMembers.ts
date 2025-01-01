

namespace Lexy.Compiler.Language.Types;

public abstract class TypeWithMembers : VariableType, ITypeWithMembers
{
   public abstract VariableType MemberType(string name, IValidationContext context);
}
