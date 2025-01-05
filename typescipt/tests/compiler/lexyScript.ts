import {ExecutableFunction} from "../../src/compiler/executableFunction";
import {parseNodes} from "../parseFunctions";
import {firstOrDefault} from "../../src/infrastructure/enumerableExtensions";
import {instanceOfFunction} from "../../src/language/functions/function";
import {LexyCompiler} from "../../src/compiler/lexyCompiler";
import {ExecutionEnvironment} from "../../src/compiler/executionEnvironment";
import {ExecutionContext} from "../../src/runTime/executionContext";

export function compileFunction(code: string): ExecutableFunction {
  let {nodes, logger} = parseNodes(code);

  const array = nodes.asArray();
  let functionNode = firstOrDefault(array, value => instanceOfFunction(value));

  let compiler = new LexyCompiler(logger, new ExecutionEnvironment(new ExecutionContext(logger)));
  let environment = compiler.compile(array);
  return environment.getFunction(functionNode);
}