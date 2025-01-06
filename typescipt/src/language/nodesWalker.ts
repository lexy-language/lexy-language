import {INode} from "./node";

export class NodesWalker {

   public static walkNodes(nodes: Array<INode>, action: (node : INode) => void): void {
     for (const node of nodes) {
       NodesWalker.walk(node, action);
     }
   }

   public static walk(node: INode, action: (node : INode) => void): void {

     action(node);

     let children = node.getChildren();
     NodesWalker.walkNodes(children, action);
   }

   public static walkWithBoolean(nodes: Array<INode>, functionValue: (node : INode) => boolean): boolean {

    for (const node of nodes) {
      if (!functionValue(node)) return false;

      let children = node.getChildren();
      if (!NodesWalker.walkWithBoolean(children, functionValue)) return false;
    }

     return true;
   }

   public static walkWithResult<T>(nodes: ReadonlyArray<INode>, action: (node : INode) => T | null): Array<T> {
     let result = new Array<T>();
     NodesWalker.walkWithResultNodes(nodes, action, result);
     return result;
   }

   private static walkWithResultNode<T>(node: INode, action: (node : INode) => T | null, result: Array<T>): void {
     let actionResult = action(node);
     if (actionResult != null) result.push(actionResult);

     let children = node.getChildren();

     NodesWalker.walkWithResultNodes(children, action, result);
   }

   private static walkWithResultNodes<T>(nodes: ReadonlyArray<INode>, action: (node : INode) => T | null, result: Array<T>): void {
     for (const node of nodes) {
       NodesWalker.walkWithResultNode(node, action, result);
     }
   }
}
