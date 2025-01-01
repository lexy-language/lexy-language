

namespace Lexy.Compiler.Language;

public abstract class ParsableNode : Node, IParsableNode
{
   protected ParsableNode(SourceReference reference) : base(reference)
   {
   }

   public abstract IParsableNode Parse(IParseLineContext context);
}
