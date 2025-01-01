

export class NodesLogger {
   private readonly StringBuilder builder new(): =;
   private number indent;

   public log(nodes: Array<INode>): void {
     foreach (let node in nodes) Log(node);
   }

   private log(node: INode): void {
     builder.Append(new string(' ', indent));

     if (node is IRootNode rootNode)
       builder.AppendLine($`{rootNode.GetType().Name}: {rootNode.NodeName}`);
     else
       builder.AppendLine(node == null ? `<null>` : node?.GetType().Name);

     if (node == null) return;

     let children = node.GetChildren();

     indent += 2;
     Log(children);
     indent -= 2;
   }

   public override toString(): string {
     return builder.toString();
   }
}
