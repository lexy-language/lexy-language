import type {ILogger} from "../infrastructure/logger";

import {GeneratedType, GeneratedTypeKind} from "./generatedType";
import {CompilerResult} from "./compilerResult";
import {ExecutableFunction} from "./executableFunction";
import {normalize} from "./JavaScript/classNames";
import {LexyCodeConstants} from "./lexyCodeConstants";
import {BuiltInDateFunctions} from "../runTime/builtInDateFunctions";
import {BuiltInNumberFunctions} from "../runTime/builtInNumberFunctions";
import {BuiltInTableFunctions} from "../runTime/builtInTableFunctions";
import {SystemFunctions} from "../runTime/systemFunctions";

export interface ICompilationEnvironment extends Disposable {
  namespace: string;
  fullNamespace: string;

  addType(generatedType: GeneratedType);

  initialize(): void;

  result(): CompilerResult;
}

export class CompilationEnvironment implements ICompilationEnvironment, Disposable {
  private readonly generatedTypes: Array<GeneratedType> = [];
  private readonly enums: { [key: string]: GeneratedType } = {};
  private readonly executables: { [key: string]: ExecutableFunction } = {};
  private readonly tables: { [key: string]: GeneratedType } = {};
  private readonly types: { [key: string]: GeneratedType } = {};
  private readonly executionLogger: ILogger;
  private readonly compilationLogger: ILogger;

  public readonly namespace: string;
  public readonly fullNamespace: string;

  constructor(compilationLogger: ILogger, executionLogger: ILogger) {
    this.compilationLogger = compilationLogger;
    this.executionLogger = executionLogger;
    const now = new Date().toISOString();
    this.namespace = `environment_${normalize(now)}`;
    this.fullNamespace = `globalThis.${LexyCodeConstants.namespace}.${this.namespace}`
  }

  public initialize(): void {
    this.initializeNamespace();
    for (const generatedType of this.generatedTypes) {
      this.initializeType(generatedType);
    }
  }

  public addType(generatedType: GeneratedType): void {
    this.generatedTypes.push(generatedType);
  }

  public result(): CompilerResult {
    return new CompilerResult(this.executables, this.enums, this, this.executionLogger);
  }

  private initializeNamespace() {
    const functions = {
      builtInDateFunctions: BuiltInDateFunctions,
      builtInNumberFunctions: BuiltInNumberFunctions,
      builtInTableFunctions: BuiltInTableFunctions,
      systemFunctions: SystemFunctions
    }
    Function("functions", `if (!globalThis.${LexyCodeConstants.namespace}) globalThis.${LexyCodeConstants.namespace} = {};
    globalThis.${LexyCodeConstants.namespace}.${this.namespace} = functions;`)(functions)
  }

  private initializeType(generatedType: GeneratedType): void {
    const code = `"use strict";
const type = ${generatedType.initializationFunction}
globalThis.${LexyCodeConstants.namespace}.${this.namespace}.${generatedType.name} = type;`;

    try {
      this.compilationLogger.logDebug(`Initialization code: ${code}`)
      const initialization = new Function(code);
      initialization();
    } catch (error) {
      throw new Error(`Initialization failed: ${error}
${code}`)
    }

    switch (generatedType.kind) {
      case GeneratedTypeKind.function: {
        const executable = this.createExecutableFunction(generatedType);
        this.executables[generatedType.node.nodeName] = executable;
        break;
      }
      case GeneratedTypeKind.enum: {
        this.enums[generatedType.node.nodeName] = generatedType;
        break;
      }
      case GeneratedTypeKind.table: {
        this.tables[generatedType.node.nodeName] = generatedType;
        break;
      }
      case GeneratedTypeKind.type: {
        this.types[generatedType.node.nodeName] = generatedType;
        break;
      }
      default: {
        throw new Error(`Unknown generated type: ${generatedType.kind}`);
      }
    }
  }

  private createExecutableFunction(generatedType: GeneratedType) {
    const code = `
let ${LexyCodeConstants.parameterVariable} = new globalThis.${LexyCodeConstants.namespace}.${this.namespace}.${generatedType.name}.${LexyCodeConstants.parametersType}();
globalThis.${LexyCodeConstants.namespace}.${this.namespace}.systemFunctions.populate(${LexyCodeConstants.parameterVariable}, values);
return globalThis.${LexyCodeConstants.namespace}.${this.namespace}.${generatedType.name}(${LexyCodeConstants.parameterVariable}, context);`;

    this.compilationLogger.logDebug(`Execution code: ${code}`)

    let executable = new ExecutableFunction(new Function("values", "context", code));
    return executable;
  }

  [Symbol.dispose]() {
    Function("delete this." + this.namespace + ";")()
  }
}
