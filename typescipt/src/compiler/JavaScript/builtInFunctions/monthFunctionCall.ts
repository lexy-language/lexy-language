import {SingleArgumentFunctionCall} from "./singleArgumentFunctionCall";
import {MonthFunction} from "../../../language/expressions/functions/monthFunction";

export class MonthFunctionCall extends SingleArgumentFunctionCall {
   protected override className = "BuiltInDateFunctions";
   protected override methodName = "month";

   constructor(functionNode: MonthFunction) {
      super(functionNode);
   }
}
