import {SingleArgumentFunctionCall} from "./singleArgumentFunctionCall";
import {HourFunction} from "../../../language/expressions/functions/hourFunction";

export class HourFunctionCall extends SingleArgumentFunctionCall {
   protected override className = "BuiltInDateFunctions";
   protected override methodName = "hour";

   constructor(functionNode: HourFunction) {
      super(functionNode);
   }
}
