import {EndStartDateFunctionCall} from "./endStartDateFunctionCall";
import {SecondsFunction} from "../../../language/expressions/functions/secondsFunction";

export class SecondsFunctionCall extends EndStartDateFunctionCall {

   protected override className = "BuiltInDateFunctions";
   protected override methodName = "seconds";

   constructor(functionNode: SecondsFunction) {
      super(functionNode);
   }
}
