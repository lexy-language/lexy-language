import {ExpressionFunction} from "../../../language/expressions/functions/expressionFunction";
import {FunctionCallExpression} from "../../../language/expressions/functionCallExpression";
import {CodeWriter} from "../writers/codeWriter";

export abstract class FunctionCall {
   public expressionFunction: ExpressionFunction;

   protected constructor(expressionFunction: ExpressionFunction) {
     this.expressionFunction = expressionFunction;
   }

  public static create(expression: FunctionCallExpression): FunctionCall | null {
     return null;
  };


  public renderCustomFunction(codeWriter: CodeWriter) {
  }

  public abstract renderExpression(codeWriter: CodeWriter);
}



