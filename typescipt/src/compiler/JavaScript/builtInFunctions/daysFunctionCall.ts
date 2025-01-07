import {EndStartDateFunctionCall} from "./endStartDateFunctionCall";
import {DaysFunction} from "../../../language/expressions/functions/daysFunction";

export class DaysFunctionCall extends EndStartDateFunctionCall {
  protected override className = "BuiltInDateFunctions";
  protected override methodName = "days";

  constructor(functionNode: DaysFunction) {
    super(functionNode);
  }
}
