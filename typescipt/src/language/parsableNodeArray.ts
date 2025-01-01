

export class ParsableNodeArray {
   private IParsableNode[] values = new IParsableNode[8];

   constructor(rootNode: IParsableNode) {
     values[0] = rootNode;
   }

   public get(indent: number): IParsableNode {
     let node = values[indent];
     for (let index = indent + 1; index < values.Length; index++) {
       if (values[index] == null) break;

       values[index] = null;
     }

     return node;
   }

   public set(indent: number, node: IParsableNode): void {
     if (indent >= values.Length) Array.Resize(ref values, values.Length * 2);

     values[indent] = node;
   }
}
