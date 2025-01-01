

namespace Lexy.Compiler.Language.Tables;

public class TypeName
{
   public string Value { get; private set; } = Guid.NewGuid().ToString("D");

   public void ParseName(string parameter)
   {
     Value = parameter;
   }
}
