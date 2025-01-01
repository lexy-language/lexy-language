

namespace Lexy.Compiler.Language.Types;

public interface ITypeWithMembers
{
   VariableType MemberType(string name, IValidationContext context);
}
