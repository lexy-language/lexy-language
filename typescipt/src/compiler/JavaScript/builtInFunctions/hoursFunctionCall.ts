import {EndStartDateFunctionCall} from "./endStartDateFunctionCall";
import {HoursFunction} from "../../../language/expressions/functions/hoursFunction";

export class HoursFunctionCall extends EndStartDateFunctionCall {
   protected override className = "BuiltInDateFunctions";
   protected override methodName = "hours";

   constructor(functionNode: HoursFunction) {
      super(functionNode);
   }
}
