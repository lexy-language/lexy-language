

namespace Lexy.Compiler.Language;

public abstract class RootNode : ParsableNode, IRootNode
{
   protected RootNode(SourceReference reference) : base(reference)
   {
   }

   public abstract string NodeName { get; }
}
