import {MethodFunctionCall} from "./methodFunctionCall";
import {PowerFunction} from "../../../language/expressions/functions/powerFunction";
import {CodeWriter} from "../writers/codeWriter";
import {renderExpression} from "../writers/renderExpression";

export class PowerFunctionCall extends MethodFunctionCall {

  public powerFunction: PowerFunction

  protected override className = "BuiltInNumberFunctions";
  protected override methodName = "power";

  constructor(functionNode: PowerFunction) {
    super(functionNode);
    this.powerFunction = functionNode;
  }

  protected override renderArguments(codeWriter: CodeWriter) {
    renderExpression(this.powerFunction.numberExpression, codeWriter);
    codeWriter.write(", ");
    renderExpression(this.powerFunction.powerExpression, codeWriter);
  }
}
