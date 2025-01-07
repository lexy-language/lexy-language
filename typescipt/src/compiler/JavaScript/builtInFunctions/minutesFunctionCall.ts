import {EndStartDateFunctionCall} from "./endStartDateFunctionCall";
import {MinutesFunction} from "../../../language/expressions/functions/minutesFunction";

export class MinutesFunctionCall extends EndStartDateFunctionCall {
   protected override className = "BuiltInDateFunctions";
   protected override methodName = "minutes";

   constructor(functionNode: MinutesFunction) {
      super(functionNode);
   }
}
