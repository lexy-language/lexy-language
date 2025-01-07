import {CodeWriter} from "../writers/codeWriter";
import {NoArgumentFunction} from "../../../language/expressions/functions/noArgumentFunction";
import {FunctionCall} from "./functionCall";

export abstract class NoArgumentFunctionCall extends FunctionCall {
   public noArgumentFunction: NoArgumentFunction

   protected abstract className: string;
   protected abstract methodName: string

  protected constructor(functionNode: NoArgumentFunction) {
     super(functionNode);
     this.noArgumentFunction = functionNode;
   }

   public override renderExpression(codeWriter: CodeWriter){
     codeWriter.writeNamespace();
     codeWriter.write("." + this.className + "." + this.methodName + "()");
   }
}
