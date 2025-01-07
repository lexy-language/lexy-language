import {EndStartDateFunction} from "../../../language/expressions/functions/endStartDateFunction";
import {MethodFunctionCall} from "./methodFunctionCall";
import {CodeWriter} from "../writers/codeWriter";
import {renderExpression} from "../writers/renderExpression";

export abstract class EndStartDateFunctionCall extends MethodFunctionCall {
  public functionNode: EndStartDateFunction;

  protected constructor(functionNode: EndStartDateFunction) {
    super(functionNode);
    this.functionNode = functionNode;
  }

  protected override renderArguments(codeWriter: CodeWriter) {
    renderExpression(this.functionNode.endDateExpression, codeWriter);
    codeWriter.write(", ")
    renderExpression(this.functionNode.startDateExpression, codeWriter);
  }
}
