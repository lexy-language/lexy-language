import type {IParsableNode} from "./ParsableNode";

import {ParsableNode} from "./ParsableNode";
import {SourceReference} from "../parser/sourceReference";
import {IValidationContext} from "../parser/validationContext";
import {INode} from "./node";

export function instanceOfRootNode(object: any): object is IRootNode {
   return object?.isRootNode == true;
}

export function asRootNode(object: any): IRootNode | null {
   return instanceOfRootNode(object) ? object as IRootNode : null;
}

export interface IRootNode extends IParsableNode {
   isRootNode: true;
   nodeName: string;
}

export abstract class RootNode extends ParsableNode implements IRootNode {

   public readonly isRootNode: true;
   public readonly abstract nodeName: string;

   protected constructor(reference: SourceReference){
      super(reference)
   }

   protected override validateNodeTree(context: IValidationContext, child: INode | null): void {
      if (child == null) throw new Error(`(${this.nodeType}) Child is null`);

      const rootNode = asRootNode(child);
      if (rootNode != null) {
         context.logger.setCurrentNode(rootNode);
      }

      child.validateTree(context);

      const thisAsRootNode = asRootNode(this);
      if (thisAsRootNode != null) {
         context.logger.setCurrentNode(thisAsRootNode);
      }
   }
}
