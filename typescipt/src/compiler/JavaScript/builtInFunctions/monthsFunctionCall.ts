import {EndStartDateFunctionCall} from "./endStartDateFunctionCall";
import {MonthsFunction} from "../../../language/expressions/functions/monthsFunction";

export class MonthsFunctionCall extends EndStartDateFunctionCall {
   protected override className = "BuiltInDateFunctions";
   protected override methodName = "months";

   constructor(functionNode: MonthsFunction) {
      super(functionNode);
   }
}
