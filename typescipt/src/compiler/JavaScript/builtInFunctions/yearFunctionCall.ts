import {YearFunction} from "../../../language/expressions/functions/yearFunction";
import {SingleArgumentFunctionCall} from "./singleArgumentFunctionCall";

export class YearFunctionCall extends SingleArgumentFunctionCall {
   protected override className = "BuiltInDateFunctions";
   protected override methodName = "year";

   constructor(functionNode: YearFunction) {
      super(functionNode);
   }
}
