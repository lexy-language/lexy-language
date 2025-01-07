import {SingleArgumentFunctionCall} from "./singleArgumentFunctionCall";
import {SecondFunction} from "../../../language/expressions/functions/secondFunction";

export class SecondFunctionCall extends SingleArgumentFunctionCall {
   protected override className = "BuiltInDateFunctions";
   protected override methodName = "second";

   constructor(functionNode: SecondFunction) {
      super(functionNode);
   }
}
