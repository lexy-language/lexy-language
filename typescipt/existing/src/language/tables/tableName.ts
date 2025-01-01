

namespace Lexy.Compiler.Language.Tables;

public class TableName
{
   public string Value { get; private set; } = Guid.NewGuid().ToString("D");

   public void ParseName(string parameter)
   {
     Value = parameter;
   }
}
