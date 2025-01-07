import {FunctionCall} from "./functionCall";
import {LexyFunction} from "../../../language/expressions/functions/lexyFunction";
import {CodeWriter} from "../writers/codeWriter";
import {functionClassName} from "../classNames";
import {LexyCodeConstants} from "../../lexyCodeConstants";

export class LexyFunctionCall extends FunctionCall {
  public expressionFunction: LexyFunction;

  constructor(expressionFunction: LexyFunction) {
    super(expressionFunction);
    this.expressionFunction = expressionFunction;
  }

  public renderExpression(codeWriter: CodeWriter) {
    return LexyFunctionCall.renderFunction(
      this.expressionFunction.functionName,
      this.expressionFunction.variableName,
      codeWriter);
  }

  public static renderFunction(functionName: string, variableName: string | null, codeWriter: CodeWriter) {
    codeWriter.writeNamespace();
    codeWriter.write(`${functionClassName(functionName)}(${variableName}, ${LexyCodeConstants.contextVariable})`);
    codeWriter.write(functionClassName(functionName));
  }
}
