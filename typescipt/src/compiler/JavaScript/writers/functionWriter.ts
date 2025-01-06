import type {IRootTokenWriter} from "../../IRootTokenWriter";
import type {IRootNode} from "../../../language/rootNode";
import {LexyCodeConstants} from "../../lexyCodeConstants";
import {GeneratedType, GeneratedTypeKind} from "../../generatedType";
import {asFunction, Function} from "../../../language/functions/function";
import {CompileFunctionContext, ICompileFunctionContext} from "../compileFunctionContext";
import {NodesWalker} from "../../../language/nodesWalker";
import {FunctionCall} from "../builtInFunctions/functionCall";
import {asFunctionCallExpression} from "../../../language/expressions/functionCallExpression";
import {CodeWriter} from "./codeWriter";
import {functionClassName} from "../classNames";
import {renderExpressions} from "./renderExpression";
import {createVariableClass} from "./renderVariableClass";

export class FunctionWriter implements IRootTokenWriter {

  private readonly namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  public createCode(node: IRootNode): GeneratedType {
    const functionNode = asFunction(node);
    if (functionNode == null) throw new Error(`Root token not Function`);

    let builtInFunctionCalls = this.getBuiltInFunctionCalls(functionNode);
    let context = new CompileFunctionContext(functionNode, builtInFunctionCalls) //, builtInFunctionCalls);

    return this.createFunction(functionNode, context, node);
  }

  private createFunction(functionNode: Function, context: CompileFunctionContext, node: IRootNode) {

    const initializationFunction = new CodeWriter(this.namespace)
    initializationFunction.openScope("function scope()");
    this.renderRunFunction(functionNode, context, initializationFunction);
    createVariableClass(LexyCodeConstants.parametersType, functionNode.parameters.variables, context, initializationFunction);
    createVariableClass(LexyCodeConstants.resultsType, functionNode.results.variables, context, initializationFunction);
    initializationFunction.writeLine(`${LexyCodeConstants.runMethod}.${LexyCodeConstants.parametersType} = ${LexyCodeConstants.parametersType};`)
    initializationFunction.writeLine(`${LexyCodeConstants.runMethod}.${LexyCodeConstants.resultsType} = ${LexyCodeConstants.resultsType};`)
    initializationFunction.writeLine(`return ${LexyCodeConstants.runMethod};`)
    initializationFunction.closeScope("();");

    return new GeneratedType(GeneratedTypeKind.function, node, functionClassName(node.nodeName), initializationFunction.toString());
  }

  private renderRunFunction(functionNode: Function, context: CompileFunctionContext, initializationFunction: CodeWriter) {
    this.renderCustomBuiltInFunctions(functionNode, context, initializationFunction)

    initializationFunction.openScope(`function ${LexyCodeConstants.runMethod}(${LexyCodeConstants.parameterVariable}, ${LexyCodeConstants.contextVariable})`);

    this.renderResults(functionNode, initializationFunction)

    this.renderCode(functionNode, initializationFunction);

    initializationFunction.writeLine(`return ${LexyCodeConstants.resultsVariable};`);

    initializationFunction.closeScope();
  }

  private customBuiltInFunctions(context: ICompileFunctionContext): Array<string> {
    return [];
    /* where(context.builtInFunctionCalls.map(functionCall => functionCall.customMethodSyntax(context)),
      customMethodSyntax => customMethodSyntax != null));*/
  }

  private getBuiltInFunctionCalls(functionNode: Function): Array<FunctionCall> {
    return NodesWalker.walkWithResult(functionNode.code.expressions,
      node => {
        const expression = asFunctionCallExpression(node);
        return expression != null ? FunctionCall.create(expression) : null
      });
  }

  private renderCode(functionNode: Function, codeWriter: CodeWriter) {
    renderExpressions(functionNode.code.expressions, codeWriter);
  }

  private renderResults(functionNode: Function, codeWriter: CodeWriter) {
    codeWriter.writeLine(`const ${LexyCodeConstants.resultsVariable} = new ${LexyCodeConstants.resultsType}();`);
  }

  private renderCustomBuiltInFunctions(functionNode: Function, context: CompileFunctionContext, codeWriter: CodeWriter) {

  }
}

