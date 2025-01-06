import {IRootNode} from "../../language/rootNode";
import {IRootTokenWriter} from "../IRootTokenWriter";
import {FunctionWriter} from "./writers/functionWriter";
import {NodeType} from "../../language/nodeType";
import {TypeWriter} from "./writers/typeWriter";

export class JavaScriptCode {
   public static getWriter(rootNode: IRootNode): IRootTokenWriter | null {
     switch (rootNode.nodeType) {
       case NodeType.Function:
         return new FunctionWriter();
         /*
       case "EnumDefinition":
         return new EnumWriter();
       case "Table":
         return new TableWriter(); */

       case NodeType.TypeDefinition:
         return new TypeWriter();

       /* case "Scenario":
         return null; */
       default:
         throw new Error(`No writer defined: ` + rootNode.nodeType);
     }
   }
}
