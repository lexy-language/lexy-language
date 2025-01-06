import {parseNodes} from "../parseFunctions";
import {firstOrDefault} from "../../src/infrastructure/enumerableExtensions";
import {asFunction, instanceOfFunction} from "../../src/language/functions/function";
import {LexyCompiler} from "../../src/compiler/lexyCompiler";
import {LoggingConfiguration} from "../testsInitialization";
import {ExecutableFunction, FunctionResult} from "../../src/compiler/executableFunction";
import {IExecutionContext} from "../../src/runTime/executionContext";

class CompileFunctionResult {
  private executableFunction: ExecutableFunction;
  private context: IExecutionContext;

  constructor(executableFunction: ExecutableFunction, context: IExecutionContext) {
    this.executableFunction = executableFunction;
    this.context = context;
  }

  public run(values: { [key: string]: any } | null = null): FunctionResult {
    return this.executableFunction.run(this.context, values)
  }
}

export function compileFunction(code: string): CompileFunctionResult {
  let {nodes, _} = parseNodes(code);

  const array = nodes.asArray();
  const functionNode = asFunction(firstOrDefault(array, value => instanceOfFunction(value)));
  if (functionNode == null) {
    throw new Error("No function found.")
  }

  const compiler = new LexyCompiler(LoggingConfiguration.getCompilerLogger(), LoggingConfiguration.getExecutionLogger());
  const environment = compiler.compile(array);
  const context = environment.createContext();
  const executableFunction = environment.getFunction(functionNode);
  if (executableFunction == null) {
    throw new Error("No executableFunction found.")
  }
  return new CompileFunctionResult(executableFunction, context);
}