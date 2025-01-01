



namespace Lexy.Compiler.Parser;

public class NodesLogger
{
   private readonly StringBuilder builder = new();
   private int indent;

   public void Log(IEnumerable<INode> nodes)
   {
     foreach (var node in nodes) Log(node);
   }

   private void Log(INode node)
   {
     builder.Append(new string(' ', indent));

     if (node is IRootNode rootNode)
       builder.AppendLine($"{rootNode.GetType().Name}: {rootNode.NodeName}");
     else
       builder.AppendLine(node = null ? "<null>" : node?.GetType().Name);

     if (node = null) return;

     var children = node.GetChildren();

     indent += 2;
     Log(children);
     indent -= 2;
   }

   public override string ToString()
   {
     return builder.ToString();
   }
}
