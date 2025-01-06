import {ExpressionFunction} from "../../language/expressions/functions/expressionFunction";
import {firstOrDefault} from "../../infrastructure/enumerableExtensions";
import {functionClassName} from "./classNames";
import {FunctionCall} from "./builtInFunctions/functionCall";

export interface ICompileFunctionContext {
  builtInFunctionCalls: ReadonlyArray<FunctionCall>;

  get(expressionExpressionFunction: ExpressionFunction): FunctionCall | null;
}

export class CompileFunctionContext implements ICompileFunctionContext {
   private functionNode: Function;
  private builtInFunctionCallsValue: Array<FunctionCall>;

  public get builtInFunctionCalls(): ReadonlyArray<FunctionCall> {
     return this.builtInFunctionCallsValue;
  }

  constructor(functionNode: Function, builtInFunctionCalls: Array<FunctionCall>) {
    this.functionNode = functionNode;
    this.builtInFunctionCallsValue = builtInFunctionCalls;
   }

   public get(expressionFunction: ExpressionFunction): FunctionCall | null {
     return firstOrDefault(this.builtInFunctionCallsValue, call => call.expressionFunction.equals(expressionFunction));
   }
}
