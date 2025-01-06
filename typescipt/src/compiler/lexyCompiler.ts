import type {ILogger} from "../infrastructure/logger";
import type {IExecutionContext} from "../runTime/executionContext";

import {IRootNode} from "../language/rootNode";
import {CompilerResult} from "./compilerResult";
import {CompilationEnvironment, ICompilationEnvironment} from "./compilationEnvironment";
import {JavaScriptCode} from "./JavaScript/JavaScriptCode";

export interface ILexyCompiler {
  compile(nodes: Array<IRootNode>): CompilerResult;
}

export class LexyCompiler implements ILexyCompiler {
  private readonly compilationLogger: ILogger;
  private readonly executionLogger: ILogger;

   constructor(compilationLogger: ILogger, executionLogger: ILogger) {
     this.compilationLogger = compilationLogger;
     this.executionLogger = executionLogger;
   }

   public compile(nodes: Array<IRootNode>): CompilerResult {
     let environment = new CompilationEnvironment(this.compilationLogger, this.executionLogger);
     try {
       this.generateCode(nodes, environment);
       environment.initialize();
       return environment.result();
     }
     catch (e) {
       this.compilationLogger.logError(`Exception occurred during compilation: ` + e);
       throw e;
     }
   }

   private generateCode(generateNodes: Array<IRootNode>, environment: ICompilationEnvironment): void {
     generateNodes.map(node => this.generateType(node, environment));
   }

   private generateType(node: IRootNode, environment: ICompilationEnvironment): void {
     let writer = JavaScriptCode.getWriter(node, environment.fullNamespace);
     if (writer == null) throw new Error(`Invalid node type: '${node?.nodeType}'`)
     let generatedType = writer.createCode(node);
     environment.addType(generatedType);
   }
}
