

internal static class NodesWalker {
   public static walk(nodes: Array<INode>, action: Action<INode>): void {
     if (nodes == null) throw new Error(nameof(nodes));
     if (action == null) throw new Error(nameof(action));

     foreach (let node in nodes) Walk(node, action);
   }

   public static walk(node: INode, action: Action<INode>): void {
     if (node == null) throw new Error(nameof(node));
     if (action == null) throw new Error(nameof(action));

     action(node);

     let children = node.GetChildren();
     Walk(children, action);
   }

   public static walk(nodes: Array<INode>, function: Func<INode, bool>): boolean {
     if (nodes == null) throw new Error(nameof(nodes));
     if (function == null) throw new Error(nameof(function));

     foreach (let node in nodes) {
       if (!function(node)) return false;

       let children = node.GetChildren();
       if (!Walk(children, function)) return false;
     }

     return true;
   }

   public static walkWithResult<T>(nodes: Array<INode>, action: Func<INode, T>): Array<T> {
     if (nodes == null) throw new Error(nameof(nodes));
     if (action == null) throw new Error(nameof(action));

     let result = new Array<T>();
     WalkWithResult(nodes, action, result);

     return result;
   }

   private static walkWithResult<T>(node: INode, action: Func<INode, T>, result: Array<T>): void {
     let actionResult = action(node);
     if (actionResult != null) result.Add(actionResult);

     let children = node.GetChildren();

     WalkWithResult(children, action, result);
   }

   private static walkWithResult<T>(nodes: Array<INode>, action: Func<INode, T>, result: Array<T>): void {
     foreach (let node in nodes) WalkWithResult(node, action, result);
   }
}
