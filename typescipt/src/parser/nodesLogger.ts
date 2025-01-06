import type {IRootNode} from "../language/rootNode";
import type {INode} from "../language/node";
import {NodeType} from "../language/nodeType";

export class NodesLogger {
   private readonly builder: string[] = [];
   private indent: number = 0;

   public log(nodes: Array<INode>): void {
     for (const node of nodes) {
        this.logNode(node);
     }
   }

   private logNode(node: INode): void {
     this.builder.push(' '.repeat(this.indent));

     const rootNode = this.asRootNode(node)
     if (rootNode != null) {
       this.builder.push(`${NodeType[rootNode.nodeType]}: ${rootNode.nodeName}`);
     } else {
       this.builder.push(NodeType[node.nodeType]);
     }
     this.builder.push("\n")

     const children = node.getChildren();

     this.indent += 2;
     this.log(children);
     this.indent -= 2;
   }

   public toString(): string {
     return this.builder.join('');
   }

  private instanceOfRootNode(object: any): object is IRootNode {
    return object?.isRootNode == true;
  }

  private asRootNode(object: any): IRootNode | null {
    return this.instanceOfRootNode(object) ? object as IRootNode : null;
  }
}
