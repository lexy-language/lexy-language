import {SingleArgumentFunctionCall} from "./singleArgumentFunctionCall";
import {IntFunction} from "../../../language/expressions/functions/intFunction";

export class IntFunctionCall extends SingleArgumentFunctionCall {
   protected override className = "BuiltInNumberFunctions";
   protected override methodName = "int";

   constructor(functionNode: IntFunction) {
      super(functionNode);
   }
}
