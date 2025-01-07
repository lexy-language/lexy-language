import {EndStartDateFunctionCall} from "./endStartDateFunctionCall";
import {YearsFunction} from "../../../language/expressions/functions/yearsFunction";

export class YearsFunctionCall extends EndStartDateFunctionCall {
   protected override className = "BuiltInDateFunctions";
   protected override methodName = "years";

   constructor(functionNode: YearsFunction) {
      super(functionNode);
   }
}
