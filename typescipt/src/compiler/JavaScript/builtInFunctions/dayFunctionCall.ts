import {SingleArgumentFunctionCall} from "./singleArgumentFunctionCall";
import {DayFunction} from "../../../language/expressions/functions/dayFunction";

export class DayFunctionCall extends SingleArgumentFunctionCall {
  protected override className = "BuiltInDateFunctions";
  protected override methodName = "day";

  constructor(functionNode: DayFunction) {
    super(functionNode);
  }
}
