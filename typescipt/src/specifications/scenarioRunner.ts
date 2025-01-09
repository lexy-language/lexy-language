import type {ILexyCompiler} from "../compiler/lexyCompiler";
import type {IParserLogger} from "../parser/parserLogger";
import type {ISpecificationRunnerContext} from "./specificationRunnerContext";

import {CompilerResult} from "../compiler/compilerResult";
import {Function} from "../language/functions/function";
import {Scenario} from "../language/scenarios/scenario";
import {RootNodeList} from "../language/rootNodeList";
import {format} from "../infrastructure/formatting";
import {FunctionResult} from "../runTime/functionResult";
import {TypeConverter} from "./typeConverter";
import {any, firstOrDefault} from "../infrastructure/enumerableExtensions";
import {ScenarioParameters} from "../language/scenarios/scenarioParameters";
import {FunctionParameters} from "../language/functions/functionParameters";
import {VariableType} from "../language/variableTypes/variableType";
import {IRootNode} from "../language/rootNode";
import {ExecutableFunction} from "../compiler/executableFunction";
import {IExecutionContext} from "../runTime/executionContext";
import {AssignmentDefinition} from "../language/scenarios/assignmentDefinition";
import {VariableReference} from "../language/variableReference";
import {asTypeWithMembers} from "../language/variableTypes/ITypeWithMembers";

export interface IScenarioRunner {
  failed: boolean;
  scenario: Scenario;

  run(): void;

  parserLogging(): string;
}

export class ScenarioRunner implements IScenarioRunner {

  private readonly context: ISpecificationRunnerContext;
  private readonly compiler: ILexyCompiler;
  private readonly fileName: string;
  private readonly functionNode: Function;
  private readonly parserLogger: IParserLogger;
  private readonly rootNodeList: RootNodeList;

  private failedValue: boolean;

  public get failed(): boolean {
    return this.failedValue;
  }

  public readonly scenario: Scenario

  constructor(fileName: string, compiler: ILexyCompiler, rootNodeList: RootNodeList, scenario: Scenario,
              context: ISpecificationRunnerContext, parserLogger: IParserLogger) {
    this.fileName = fileName;
    this.compiler = compiler;
    this.context = context;
    this.rootNodeList = rootNodeList;
    this.parserLogger = parserLogger;

    this.scenario = scenario;
    this.functionNode = scenario.functionNode ?? rootNodeList.getFunction(scenario.functionName.value);
  }

  public run(): void {
    if (this.parserLogger.nodeHasErrors(this.scenario)) {
      this.fail(` Parsing scenario failed: ${this.scenario.functionName}`);
      this.parserLogger.errorNodeMessages(this.scenario)
        .forEach(message => this.context.logGlobal(message));
      return;
    }

    if (!this.validateErrors()) return;

    const nodes = this.functionNode.getFunctionAndDependencies(this.rootNodeList);
    const compilerResult = this.compile(nodes);
    const context = compilerResult.createContext();
    const executable = compilerResult.getFunction(this.functionNode);
    const values = this.getValues(this.scenario.parameters, this.functionNode.parameters, compilerResult);

    const result = this.runFunction(executable, context, values);

    const validationResultText = this.getValidationResult(result, compilerResult);
    if (validationResultText.length > 0) {
      this.fail(validationResultText);
    } else {
      this.context.success(this.scenario);
    }
  }

  private runFunction(executable: ExecutableFunction, context: IExecutionContext, values: { [key: string]: any } | null) {
    try {
      return executable.run(context, values);
    } catch (error) {
      throw new Error("Exception occurred while running scenario '" + this.scenario.name + "' from '" + this.fileName + "'\n" + error.stack)
    }
  }

  private compile(nodes: Array<IRootNode>) {
    try {
      return this.compiler.compile(nodes);
    } catch (error) {
      throw new Error("Exception occurred while compiling scenario '" + this.scenario.name + "' from '" + this.fileName + "'\n" + error.stack)
    }
  }

  public parserLogging(): string {
    return `------- Filename: ${this.fileName}\n${format(this.parserLogger.errorMessages(), 2)}`;
  }

  private fail(message: string): void {
    this.failedValue = true;
    this.context.fail(this.scenario, message);
  }

  private getValidationResult(result: FunctionResult, compilerResult: CompilerResult): string {
    const validationResult: Array<string> = [];
    for (const expected of this.scenario.results.assignments) {
      let actual = result.getValue(expected.variable);
      let expectedValue =
        TypeConverter.convert(compilerResult, expected.constantValue.value, expected.variableType);

      if (actual == null || expectedValue == null || !ScenarioRunner.compare(actual, expectedValue)) {
        validationResult.push(
          `'${expected.variable}' should be '${expectedValue ?? `<null>`}' (${expectedValue?.constructor.name}) but is '${actual ?? `<null>`} (${actual?.constructor.name})'`);
      }
    }

    return validationResult.toString();
  }

  private validateErrors(): boolean {
    if (this.scenario.expectRootErrors.hasValues) return this.validateRootErrors();

    let node = this.functionNode ?? this.scenario.functionNode ?? this.scenario.enum ?? this.scenario.table;
    let failedMessages = this.parserLogger.errorNodeMessages(node);

    if (failedMessages.length > 0 && !this.scenario.expectError.hasValue) {
      this.fail(`Exception occurred: ${format(failedMessages, 2)}`);
      return false;
    }

    if (!this.scenario.expectError.hasValue) return true;

    if (failedMessages.length == 0) {
      this.fail(`No exception \n` +
        ` Expected: ${this.scenario.expectError.message}\n`);
      return false;
    }

    if (!any(failedMessages, message => this.scenario.expectError.message != null && message.includes(this.scenario.expectError.message))) {
      this.fail(`Wrong exception \n` +
        ` Expected: ${this.scenario.expectError.message}\n` +
        ` Actual: ${format(failedMessages, 4)}`);
      return false;
    }

    this.context.success(this.scenario);
    return false;
  }

  private validateRootErrors(): boolean {
    let failedMessages = this.parserLogger.errorMessages();
    if (!any(failedMessages)) {
      this.fail(`No exceptions \n` +
        ` Expected: ${format(this.scenario.expectRootErrors.messages, 4)}{Environment.NewLine}` +
        ` Actual: none`);
      return false;
    }

    let failed = false;
    for (const rootMessage of this.scenario.expectRootErrors.messages) {
      let failedMessage = firstOrDefault(failedMessages, message => message.includes(rootMessage));
      if (failedMessage != null) {
        failedMessages = failedMessages.filter(item => item !== failedMessage);
      } else {
        failed = true;
      }
    }

    if (!any(failedMessages) && !failed) {
      this.context.success(this.scenario);
      return false; // don't compile and run rest of scenario
    }

    this.fail(`Wrong exception \n` +
      ` Expected: ${format(this.scenario.expectRootErrors.messages, 4)}\n` +
      ` Actual: ${format(this.parserLogger.errorMessages(), 4)}`);
    return false;
  }

  private getValues(scenarioParameters: ScenarioParameters, functionParameters: FunctionParameters,
                    compilerResult: CompilerResult): { [key: string], value: any } {
    let result = {};
    for (const parameter of scenarioParameters.assignments) {
      this.setParameter(functionParameters, parameter, compilerResult, result);
    }

    return result;
  }

  private setParameter(functionParameters: FunctionParameters, parameter: AssignmentDefinition, compilerResult: CompilerResult, result: {}) {
    let type = firstOrDefault(functionParameters.variables, variable => variable.name == parameter.variable.parentIdentifier);

    if (type == null) {
      throw new Error(`Function '${this.functionNode.name}' parameter '${parameter.variable.parentIdentifier}' not found.`);
    }

    const value = ScenarioRunner.getValue(compilerResult, parameter.constantValue.value, parameter.variableType);

    let valueObject = result;
    let reference = parameter.variable;
    while(reference.hasChildIdentifiers) {
      if (!valueObject[reference.parentIdentifier]) {
        valueObject[reference.parentIdentifier] = {};
      }
      valueObject = valueObject[reference.parentIdentifier];
      reference = reference.childrenReference();

      //todo verify var types of nested parameters
    }
    valueObject[reference.parentIdentifier] = value;
  }

  private static getValue(compilerResult: CompilerResult, value: object, type: VariableType): object {
    return TypeConverter.convert(compilerResult, value, type);
  }

  private static compare(actual: object, expectedValue: object): boolean {
    if (expectedValue?.constructor == Date && actual?.constructor == Date) {
      return actual.toISOString() == expectedValue.toISOString();
    }
    return actual == expectedValue;
  }
}
