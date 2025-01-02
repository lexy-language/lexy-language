import {INode, Node} from "./node";
import {SourceReference} from "../parser/sourceReference";
import {IParseLineContext} from "../parser/ParseLineContext";
import {nameOf} from "../infrastructure/nameOf";

export function instanceOfParsableNode(object: any): object is IParsableNode {
   return nameOf<IParsableNode>("isParsableNode") in object;
}

export function asParsableNode(object: any): IParsableNode | null {
   return instanceOfParsableNode(object) ? object as IParsableNode : null;
}

export interface IParsableNode extends INode {
   isParsableNode: true;
   parse(context: IParseLineContext ): IParsableNode;
}

export abstract class ParsableNode extends Node implements IParsableNode {
   protected constructor(reference: SourceReference) {
      super(reference);
   }

   public isParsableNode: true;
   public abstract parse(context: IParseLineContext): IParsableNode;
}
