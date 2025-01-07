import {ISpecificationRunnerContext} from "./specificationRunnerContext";
import {ILexyParser} from "../parser/lexyParser";
import {IParserLogger} from "../parser/parserLogger";
import {IScenarioRunner, ScenarioRunner} from "./scenarioRunner";
import {firstOrDefault} from "../infrastructure/enumerableExtensions";
import {format} from "../infrastructure/formatting";
import {Scenario} from "../language/scenarios/scenario";
import {RootNodeList} from "../language/rootNodeList";
import {ILexyCompiler} from "../compiler/lexyCompiler";
import {ParserResult} from "../parser/parserResult";

export interface ISpecificationFileRunner {
  scenarioRunners: ReadonlyArray<IScenarioRunner>;

  countScenarioRunners(): number;
  run(): void;
}

export class SpecificationFileRunner implements ISpecificationFileRunner {

  private readonly compiler: ILexyCompiler;
  private readonly parser: ILexyParser;
  private readonly fileName: string;
  private readonly runnerContext: ISpecificationRunnerContext;
  private readonly scenarioRunnersValue: Array<IScenarioRunner> = [];

  private result: ParserResult;

  public get scenarioRunners(): ReadonlyArray<IScenarioRunner> {
    return [...this.scenarioRunnersValue]
  }

  constructor(fileName: string, compiler: ILexyCompiler, parser: ILexyParser, runnerContext: ISpecificationRunnerContext) {
    this.fileName = fileName;
    this.compiler = compiler;
    this.parser = parser;
    this.runnerContext = runnerContext;
  }


  initialize() {
    try {
      this.result = this.parser.parseFile(this.fileName, false);
    } catch(e) {
      throw new Error("Error while parsing " + this.fileName + "\n" + e.stack + "\n--------------------------------------\n")
    }
    this.result
      .rootNodes
      .getScenarios()
      .forEach(scenario =>
        this.scenarioRunnersValue.push(this.getScenarioRunner(scenario, this.result.rootNodes, this.result.logger)));
  }

  public run(): void {

    this.validateHasScenarioCheckingRootErrors(this.result.logger);

    if (this.scenarioRunners.length == 0) return;

    this.runnerContext.logGlobal(`Filename: ${this.fileName}`);

    this.scenarioRunners.forEach(runner => runner.run());
  }

  private getScenarioRunner(scenario: Scenario, rootNodeList: RootNodeList, parserLogger: IParserLogger) {
    return new ScenarioRunner(this.fileName, this.compiler, rootNodeList, scenario, this.runnerContext, parserLogger);
  }

  public countScenarioRunners(): number {
    return this.scenarioRunners.length;
  }

  private validateHasScenarioCheckingRootErrors(logger: IParserLogger): void {
    if (!logger.hasRootErrors()) return;

    let rootScenarioRunner =
      firstOrDefault(this.scenarioRunners, runner => runner.scenario.expectRootErrors.hasValues);

    if (rootScenarioRunner == null) {
      const rootErrors = format(logger.errorRootMessages(), 2);
      throw new Error(
        `${this.fileName} has root errors but no scenario that verifies expected root errors. Errors: ${rootErrors}`);
    }
  }
}
