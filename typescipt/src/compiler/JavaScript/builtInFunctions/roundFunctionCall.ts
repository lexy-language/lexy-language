import {MethodFunctionCall} from "./methodFunctionCall";
import {RoundFunction} from "../../../language/expressions/functions/roundFunction";
import {CodeWriter} from "../writers/codeWriter";
import {renderExpression} from "../writers/renderExpression";

export class RoundFunctionCall extends MethodFunctionCall {
  public roundFunction: RoundFunction;

  protected override className = "BuiltInNumberFunctions";
  protected override methodName = "round";

  constructor(functionNode: RoundFunction) {
    super(functionNode);
    this.roundFunction = functionNode;
  }

  protected override renderArguments(codeWriter: CodeWriter) {
    renderExpression(this.roundFunction.numberExpression, codeWriter);
    codeWriter.write(", ");
    renderExpression(this.roundFunction.digitsExpression, codeWriter);
  }
}
