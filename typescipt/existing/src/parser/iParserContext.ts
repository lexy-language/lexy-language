

namespace Lexy.Compiler.Parser;

public interface IParserContext
{
   IParserLogger Logger { get; }

   Line CurrentLine { get; }

   ISourceCodeDocument SourceCode { get; }
   RootNodeList Nodes { get; }
   SourceCodeNode RootNode { get; }

   void AddFileIncluded(string fileName);
   bool IsFileIncluded(string fileName);
}
