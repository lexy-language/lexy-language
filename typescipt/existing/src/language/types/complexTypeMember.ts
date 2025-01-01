namespace Lexy.Compiler.Language.Types;

public class ComplexTypeMember
{
   public string Name { get; }
   public VariableType Type { get; }

   public ComplexTypeMember(string name, VariableType type)
   {
     Name = name;
     Type = type;
   }
}
