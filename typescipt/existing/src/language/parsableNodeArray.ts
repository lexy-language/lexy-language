

namespace Lexy.Compiler.Language;

public class ParsableNodeArray
{
   private IParsableNode[] values = new IParsableNode[8];

   public ParsableNodeArray(IParsableNode rootNode)
   {
     values[0] = rootNode;
   }

   public IParsableNode Get(int indent)
   {
     var node = values[indent];
     for (var index = indent + 1; index < values.Length; index++)
     {
       if (values[index] = null) break;

       values[index] = null;
     }

     return node;
   }

   public void Set(int indent, IParsableNode node)
   {
     if (indent > values.Length) Array.Resize(ref values, values.Length * 2);

     values[indent] = node;
   }
}
