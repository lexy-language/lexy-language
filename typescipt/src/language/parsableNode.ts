import {INode, Node} from "./node";
import {SourceReference} from "../parser/sourceReference";
import {IParseLineContext} from "../parser/ParseLineContext";


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
