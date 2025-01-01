

namespace Lexy.Compiler.Parser;

public class ParserResult
{
   public RootNodeList RootNodes { get; }

   public ParserResult(RootNodeList rootNodes)
   {
     RootNodes = rootNodes;
   }
}
