import type {ISpecificationFileRunner} from "./specificationFileRunner";
import type {IScenarioRunner} from "./scenarioRunner";
import type {ILogger} from "../infrastructure/logger";

import {Scenario} from "../language/scenarios/scenario";
import {format} from "../infrastructure/formatting";

export interface ISpecificationRunnerContext {
  failed: number
  fileRunners: ReadonlyArray<ISpecificationFileRunner>

  fail(scenario: Scenario, message: string);
  success(scenario: Scenario);

  logGlobal(message: string);

  add(fileRunner: ISpecificationFileRunner);

  failedScenariosRunners(): ReadonlyArray<IScenarioRunner>;
  countScenarios(): number;

  formatGlobalLog(): string;
}

export class SpecificationRunnerContext implements ISpecificationRunnerContext {

  private globalLog: Array<string> = [];
  private readonly fileRunnersValue: Array<ISpecificationFileRunner> = [];
  private readonly logger: ILogger;
  private failedValues = 0;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  public get failed(): number {
    return this.failedValues;
  }

  public get fileRunners() {
    return this.fileRunnersValue;
  }

  public fail(scenario: Scenario, message: string): void {
    this.failedValues++;

    let log = `- FAILED - ${scenario.name}: ${message}`;

    this.globalLog.push(log)
    this.logger.logError(log);
  }

  public logGlobal(message: string): void {
    this.globalLog.push(message)
    this.logger.logInformation(message);
  }

  public log(message: string): void {
    let log = ` ${message}`;
    this.logger.logInformation(log);
  }

  public success(scenario: Scenario): void {
    let log = `- SUCCESS - ${scenario.name}`;
    this.globalLog.push(log)
    this.logger.logInformation(log);
  }

  public add(fileRunner: ISpecificationFileRunner): void {
    this.fileRunners.push(fileRunner);
  }

  public failedScenariosRunners(): Array<IScenarioRunner> {
    const result = [];
    this.fileRunners.forEach(runner =>
      runner.scenarioRunners.forEach(scenario => {
        if (scenario.failed) result.push(scenario)
      }));
    return result;
  }

  public countScenarios(): number {
    let total = 0;
    this.fileRunners.map(fileRunner => total += fileRunner.countScenarioRunners());
    return total;
  }

  public formatGlobalLog(): string {
    return format(this.globalLog, 2);
  }
}
