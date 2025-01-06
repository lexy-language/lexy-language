import {Function} from "../functions/function";
import {RootNode} from "../rootNode";
import {ScenarioName} from "./scenarioName";
import {EnumDefinition} from "../enums/enumDefinition";
import {Table} from "../tables/table";
import {ScenarioExpectError} from "./scenarioExpectError";
import {ScenarioExpectRootErrors} from "./scenarioExpectRootErrors";
import {ScenarioTable} from "./scenarioTable";
import {ScenarioResults} from "./scenarioResults";
import {ScenarioParameters} from "./scenarioParameters";
import {ScenarioFunctionName} from "./scenarioFunctionName";
import {SourceReference} from "../../parser/sourceReference";
import {NodeName} from "../../parser/nodeName";
import {IParseLineContext} from "../../parser/ParseLineContext";
import {IParsableNode} from "../parsableNode";
import {KeywordToken} from "../../parser/tokens/keywordToken";
import {Keywords} from "../../parser/Keywords";
import {INode} from "../node";
import {IValidationContext} from "../../parser/validationContext";
import {VariableSource} from "../variableSource";
import {VariableDefinition} from "../variableDefinition";
import {NodeType} from "../nodeType";

export function instanceOfScenario(object: any) {
  return object?.nodeType == NodeType.Scenario;
}

export function asScenario(object: any): Scenario | null {
  return instanceOfScenario(object) ? object as Scenario : null;
}

export class Scenario extends RootNode {

  private functionNodeValue: Function | null;
  private enumValue: EnumDefinition | null;
  private tableValue: Table | null;

  public readonly nodeType = NodeType.Scenario;
  public readonly name: ScenarioName;

  public get functionNode(): Function | null {
    return this.functionNodeValue;
  }

  public get enum(): EnumDefinition | null {
    return this.enumValue;
  }

  public get table(): Table | null {
    return this.tableValue;
  }

  public readonly functionName: ScenarioFunctionName;

  public readonly parameters: ScenarioParameters;
  public readonly results: ScenarioResults;
  public readonly validationTable: ScenarioTable;

  public readonly expectError: ScenarioExpectError;
  public readonly expectRootErrors: ScenarioExpectRootErrors;

  public override get nodeName() {
    return this.name.value;
  }

  constructor(name: string, reference: SourceReference) {
    super(reference);
    this.name = new ScenarioName(reference);
    this.functionName = new ScenarioFunctionName(reference);

    this.parameters = new ScenarioParameters(reference);
    this.results = new ScenarioResults(reference);
    this.validationTable = new ScenarioTable(reference);

    this.expectError = new ScenarioExpectError(reference);
    this.expectRootErrors = new ScenarioExpectRootErrors(reference);

    this.name.parseName(name);
  }

  public static parse(name: string, reference: SourceReference): Scenario {
    return new Scenario(name, reference);
  }

  public override parse(context: IParseLineContext): IParsableNode {
    let line = context.line;
    let name = line.tokens.tokenValue(0);
    let reference = line.lineStartReference();
    if (!line.tokens.isTokenType<KeywordToken>(0, KeywordToken)) {
      context.logger.fail(reference, `Invalid token '${name}'. Keyword expected.`);
      return this;
    }

    switch (name) {
      case Keywords.FunctionKeyword:
        return this.parseFunction(context, reference);
      case Keywords.EnumKeyword:
        return this.parseEnum(context, reference);
      case Keywords.TableKeyword:
        return this.parseTable(context, reference);
      case Keywords.Function:
        return this.resetRootNode(context, this.parseFunctionName(context));
      case Keywords.Parameters:
        return this.resetRootNode(context, this.parameters);
      case Keywords.Results:
        return this.resetRootNode(context, this.results);
      case Keywords.ValidationTable:
        return this.resetRootNode(context, this.validationTable);
      case Keywords.ExpectError:
        return this.resetRootNode(context, this.expectError.parse(context));
      case Keywords.ExpectRootErrors:
        return this.resetRootNode(context, this.expectRootErrors);
      default:
        return this.invalidToken(context, name, reference);
    }
  }

  private resetRootNode(parserContext: IParseLineContext, node: IParsableNode): IParsableNode {
    parserContext.logger.setCurrentNode(this);
    return node;
  }

  private parseFunctionName(context: IParseLineContext): IParsableNode {
    this.functionName.parse(context);
    return this;
  }

  private parseFunction(context: IParseLineContext, reference: SourceReference): IParsableNode {
    if (this.functionNodeValue != null) {
      context.logger.fail(reference, `Duplicated inline Function '${this.nodeName}'.`);
      return this.functionNodeValue;
    }

    let tokenName = NodeName.parse(context);
    if (tokenName != null && tokenName.name != null) {
      context.logger.fail(context.line.tokenReference(1),
        `Unexpected function name. Inline function should not have a name: '${tokenName.name}'`);
    }

    this.functionNodeValue = Function.create(`${this.name.value}Function`, reference, context.expressionFactory);
    context.logger.setCurrentNode(this.functionNodeValue);
    return this.functionNodeValue;
  }

  private parseEnum(context: IParseLineContext, reference: SourceReference): IParsableNode {
    if (this.enum != null) {
      context.logger.fail(reference, `Duplicated inline Enum '${this.nodeName}'.`);
      return this.enum;
    }

    let tokenName = NodeName.parse(context);
    if (tokenName == null || tokenName.name == null) return this;

    this.enumValue = EnumDefinition.parse(tokenName.name, reference);
    context.logger.setCurrentNode(this.enumValue);
    return this.enumValue;
  }

  private parseTable(context: IParseLineContext, reference: SourceReference): IParsableNode {
    if (this.table != null) {
      context.logger.fail(reference, `Duplicated inline Enum '${this.nodeName}'.`);
      return this.table;
    }

    let tokenName = NodeName.parse(context);
    if (tokenName == null || tokenName.name == null) return this;

    this.tableValue = Table.parse(tokenName.name, reference);
    context.logger.setCurrentNode(this.tableValue);
    return this.tableValue;
  }

  private invalidToken(context: IParseLineContext, name: string | null, reference: SourceReference): IParsableNode {
    context.logger.fail(reference, `Invalid token '${name}'.`);
    return this;
  }

  public override getChildren(): Array<INode> {
    const result: Array<INode> = [];
    if (this.functionNodeValue != null) result.push(this.functionNodeValue);
    if (this.enumValue != null) result.push(this.enumValue);
    if (this.tableValue != null) result.push(this.tableValue);

    return [
      ...result,
      this.name,
      this.functionName,
      this.parameters,
      this.results,
      this.validationTable,
      this.expectError,
      this.expectRootErrors
    ];
  }

  protected override validateNodeTree(context: IValidationContext, child: INode): void {
    if (child === this.parameters || child === this.results) {
      this.validateParameterOrResultNode(context, child);
      return;
    }

    super.validateNodeTree(context, child);
  }

  private validateParameterOrResultNode(context: IValidationContext, child: INode): void {
    const scope = context.createVariableScope();
    try {
      this.addFunctionParametersAndResultsForValidation(context);
      super.validateNodeTree(context, child);
    } finally {
      scope[Symbol.dispose]();
    }
  }

  private addFunctionParametersAndResultsForValidation(context: IValidationContext): void {
    let functionNode = this.functionNode ?? (this.functionName != null ? context.rootNodes.getFunction(this.functionName.value) : null);
    if (functionNode == null) return;

    this.addVariablesForValidation(context, functionNode.parameters.variables, VariableSource.Parameters);
    this.addVariablesForValidation(context, functionNode.results.variables, VariableSource.Results);
  }

  private addVariablesForValidation(context: IValidationContext, definitions: ReadonlyArray<VariableDefinition>,
                                    source: VariableSource) {
    for (const definition of definitions) {
      let variableType = definition.type.createVariableType(context);
      if (variableType == null) continue;
      context.variableContext.addVariable(definition.name, variableType, source);
    }
  }

  protected override validate(context: IValidationContext): void {
    if (this.functionName.isEmpty() && this.functionNode == null && this.enum == null && this.table == null && !this.expectRootErrors.hasValues) {
      context.logger.fail(this.reference, `Scenario has no function, enum, table or expect errors.`);
    }
  }
}
