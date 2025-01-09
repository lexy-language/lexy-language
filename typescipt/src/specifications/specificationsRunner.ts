import type {ILogger} from "../infrastructure/logger";

import {ISpecificationRunnerContext, SpecificationRunnerContext} from "./specificationRunnerContext";
import {IFileSystem} from "../parser/IFileSystem";
import {SpecificationFileRunner} from "./specificationFileRunner";
import {LexySourceDocument} from "../parser/lexySourceDocument";
import {ILexyParser} from "../parser/lexyParser";
import {ILexyCompiler} from "../compiler/lexyCompiler";

export interface ISpecificationsRunner {
  run(folder: string);
  runAll(file: string);
}

export class SpecificationsRunner implements ISpecificationsRunner {

  private readonly parser: ILexyParser;
  private readonly compiler: ILexyCompiler;
  private readonly logger: ILogger;
  private readonly fileSystem: IFileSystem;

  constructor(logger: ILogger, fileSystem: IFileSystem, parser: ILexyParser, compiler: ILexyCompiler) {
    this.logger = logger;
    this.fileSystem = fileSystem;
    this.parser = parser;
    this.compiler = compiler;
  }

  public run(file: string): void {
    const context = new SpecificationRunnerContext(this.logger);
    this.createFileRunner(context, file);
    SpecificationsRunner.runScenarios(context);
  }

  public runAll(folder: string): void {
    const context = new SpecificationRunnerContext(this.logger);
    this.getRunners(context, folder);
    SpecificationsRunner.runScenarios(context);
  }

  private static runScenarios(context: ISpecificationRunnerContext): void {
    let runners = context.fileRunners;
    let countScenarios = context.countScenarios();
    context.logGlobal(`Specifications found: ${countScenarios}`);
    if (runners.length == 0) throw new Error(`No specifications found`);

    runners.forEach(runner => runner.run());

    context.logGlobal(`Specifications succeed: ${countScenarios - context.failed} / ${countScenarios}`);
    context.logTimeSpent();

    if (context.failed > 0) SpecificationsRunner.failed(context);
  }

  private static failed(context: ISpecificationRunnerContext): void {
    context.logGlobal(`--------------- FAILED PARSER LOGGING ---------------`);
    for (const runner of context.failedScenariosRunners()) {
      console.log(runner.parserLogging());
    }
    throw new Error(`Specifications failed: ${context.failed}\n${context.formatGlobalLog()}`);
  }

  private getRunners(context: ISpecificationRunnerContext, folder: string): void {
    let absoluteFolder = this.getAbsoluteFolder(folder);

    context.logGlobal(`Specifications folder: ${absoluteFolder}`);

    this.addFolder(context, absoluteFolder);
  }

  private addFolder(context: ISpecificationRunnerContext, folder: string): void {
    let files = this.fileSystem.getDirectoryFiles(folder, `.${LexySourceDocument.fileExtension}`);

    files
      .sort()
      .forEach(file => this.createFileRunner(context, this.fileSystem.combine(folder, file)));

    this.fileSystem.getDirectories(folder)
      .sort()
      .forEach(eachFolder => this.addFolder(context, this.fileSystem.combine(folder, eachFolder)));
  }

  private createFileRunner(context: ISpecificationRunnerContext, fileName: string): void {
    let runner = new SpecificationFileRunner(fileName, this.compiler, this.parser, context);
    runner.initialize();
    context.add(runner);
  }

  private getAbsoluteFolder(folder: string): string {
    let absoluteFolder = this.fileSystem.isPathRooted(folder)
      ? folder
      : this.fileSystem.getFullPath(folder);
    if (!this.fileSystem.directoryExists(absoluteFolder)) {
      throw new Error(`Specifications folder doesn't exist: ${absoluteFolder}`);
    }

    return absoluteFolder;
  }
}