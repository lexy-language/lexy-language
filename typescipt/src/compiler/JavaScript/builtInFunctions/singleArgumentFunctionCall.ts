import {MethodFunctionCall} from "./methodFunctionCall";
import {SingleArgumentFunction} from "../../../language/expressions/functions/singleArgumentFunction";
import {CodeWriter} from "../writers/codeWriter";
import {renderExpression} from "../writers/renderExpression";

export abstract class SingleArgumentFunctionCall extends MethodFunctionCall {

  public singleArgumentFunction: SingleArgumentFunction;

  constructor(functionNode: SingleArgumentFunction) {
     super(functionNode);
     this.singleArgumentFunction = functionNode;
   }

   public override renderMethodSyntax(codeWriter: CodeWriter) {
   }

   protected override renderArguments(codeWriter: CodeWriter) {
     renderExpression(this.singleArgumentFunction.valueExpression, codeWriter);
   }
}
