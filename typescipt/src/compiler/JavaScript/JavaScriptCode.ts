import {IRootNode} from "../../language/rootNode";
import {IRootTokenWriter} from "../IRootTokenWriter";
import {FunctionWriter} from "./writers/functionWriter";
import {NodeType} from "../../language/nodeType";
import {TypeWriter} from "./writers/typeWriter";
import {TableWriter} from "./writers/tableWriter";

export class JavaScriptCode {
   public static getWriter(rootNode: IRootNode, namespace: string): IRootTokenWriter | null {
     switch (rootNode.nodeType) {
       case NodeType.Function:
         return new FunctionWriter(namespace);
         /*
       case "EnumDefinition":
         return new EnumWriter(); */
       case NodeType.Table:
         return new TableWriter(namespace);
       case NodeType.TypeDefinition:
         return new TypeWriter(namespace);
       /* case "Scenario":
         return null; */
       default:
         throw new Error(`No writer defined: ` + NodeType[rootNode.nodeType]);
     }
   }
}
