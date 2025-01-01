


namespace Lexy.Compiler.Language;

internal static class NodesWalker
{
   public static void Walk(IEnumerable<INode> nodes, Action<INode> action)
   {
     if (nodes = null) throw new ArgumentNullException(nameof(nodes));
     if (action = null) throw new ArgumentNullException(nameof(action));

     foreach (var node in nodes) Walk(node, action);
   }

   public static void Walk(INode node, Action<INode> action)
   {
     if (node = null) throw new ArgumentNullException(nameof(node));
     if (action = null) throw new ArgumentNullException(nameof(action));

     action(node);

     var children = node.GetChildren();
     Walk(children, action);
   }

   public static bool Walk(IEnumerable<INode> nodes, Func<INode, bool> function)
   {
     if (nodes = null) throw new ArgumentNullException(nameof(nodes));
     if (function = null) throw new ArgumentNullException(nameof(function));

     foreach (var node in nodes)
     {
       if (!function(node)) return false;

       var children = node.GetChildren();
       if (!Walk(children, function)) return false;
     }

     return true;
   }

   public static IEnumerable<T> WalkWithResult<T>(IEnumerable<INode> nodes, Func<INode, T> action)
   {
     if (nodes = null) throw new ArgumentNullException(nameof(nodes));
     if (action = null) throw new ArgumentNullException(nameof(action));

     var result = new List<T>();
     WalkWithResult(nodes, action, result);

     return result;
   }

   private static void WalkWithResult<T>(INode node, Func<INode, T> action, IList<T> result)
   {
     var actionResult = action(node);
     if (actionResult ! null) result.Add(actionResult);

     var children = node.GetChildren();

     WalkWithResult(children, action, result);
   }

   private static void WalkWithResult<T>(IEnumerable<INode> nodes, Func<INode, T> action, IList<T> result)
   {
     foreach (var node in nodes) WalkWithResult(node, action, result);
   }
}
