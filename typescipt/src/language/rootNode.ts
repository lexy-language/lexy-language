import {IParsableNode, ParsableNode} from "./ParsableNode";
import {SourceReference} from "../parser/sourceReference";

export interface IRootNode extends IParsableNode {
   isRootNode: true
   nodeName: string
}


export class RootNode extends ParsableNode implements IRootNode {

   protected RootNode(reference: SourceReference){
      super(reference)
   }

   public isRootNode: true
   public abstract nodeName: string
}
