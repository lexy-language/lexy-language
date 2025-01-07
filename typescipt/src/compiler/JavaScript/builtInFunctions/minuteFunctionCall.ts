import {SingleArgumentFunctionCall} from "./singleArgumentFunctionCall";
import {MinuteFunction} from "../../../language/expressions/functions/minuteFunction";

export class MinuteFunctionCall extends SingleArgumentFunctionCall {
   protected override className = "BuiltInDateFunctions";
   protected override methodName = "minute";

   constructor(functionNode: MinuteFunction) {
      super(functionNode);
   }
}
