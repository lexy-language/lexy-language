import {IParsableNode, ParsableNode} from "./ParsableNode";
import {SourceReference} from "../parser/sourceReference";
import {nameOf} from "../infrastructure/nameOf";

export function instanceOfRootNode(object: any): object is IRootNode {
   return nameOf<IRootNode>("isRootNode") in object;
}

export function asRootNode(object: any): IRootNode | null {
   return instanceOfRootNode(object) ? object as IRootNode : null;
}

export interface IRootNode extends IParsableNode {
   isRootNode: true
   nodeName: string
}

export abstract class RootNode extends ParsableNode implements IRootNode {

   protected constructor(reference: SourceReference){
      super(reference)
   }

   public isRootNode: true
   public abstract nodeName: string
}
