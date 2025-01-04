import type {INode} from "./node";
import type {IParseLineContext} from "../parser/ParseLineContext";

import {Node} from "./node";
import {SourceReference} from "../parser/sourceReference";

export function instanceOfParsableNode(object: any): object is IParsableNode {
   return object?.isParsableNode == true;
}

export function asParsableNode(object: any): IParsableNode | null {
   return instanceOfParsableNode(object) ? object as IParsableNode : null;
}

export interface IParsableNode extends INode {
   isParsableNode: true;
   parse(context: IParseLineContext): IParsableNode;
}

export abstract class ParsableNode extends Node implements IParsableNode {
   protected constructor(reference: SourceReference) {
      super(reference);
   }

   public isParsableNode: true;
   public abstract parse(context: IParseLineContext): IParsableNode;
}
