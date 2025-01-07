import {NoArgumentFunctionCall} from "./noArgumentFunctionCall";
import {NowFunction} from "../../../language/expressions/functions/nowFunction";


export class NowFunctionCall extends NoArgumentFunctionCall {
   protected override className = "BuiltInDateFunctions";
   protected override methodName = "now";

   constructor(functionNode: NowFunction) {
      super(functionNode);
   }
}
