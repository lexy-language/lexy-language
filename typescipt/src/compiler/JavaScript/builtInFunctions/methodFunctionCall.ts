import {FunctionCall} from "./functionCall";
import {ExpressionFunction} from "../../../language/expressions/functions/expressionFunction";
import {CodeWriter} from "../writers/codeWriter";

export abstract class MethodFunctionCall extends FunctionCall {
  public functionNode: ExpressionFunction

  public abstract className: string
  public abstract methodName: string

  constructor(functionNode: ExpressionFunction) {
    super(functionNode);
    this.functionNode = functionNode;
  }

  public override renderExpression(codeWriter: CodeWriter) {
    codeWriter.writeNamespace();
    codeWriter.write("." + this.className + "." + this.methodName + "(");
    this.renderArguments(codeWriter);
    codeWriter.write(")");
  }

  protected abstract renderArguments(codeWriter: CodeWriter);
}
