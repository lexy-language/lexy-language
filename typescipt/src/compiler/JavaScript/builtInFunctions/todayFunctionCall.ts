import {NoArgumentFunctionCall} from "./noArgumentFunctionCall";
import {TodayFunction} from "../../../language/expressions/functions/todayFunction";

export class TodayFunctionCall extends NoArgumentFunctionCall {
   protected override className = "BuiltInDateFunctions";
   protected override methodName = "today";

   constructor(functionNode: TodayFunction) {
      super(functionNode);
   }
}
